import { BaseCommand } from '@adonisjs/core/ace'
import fs from 'node:fs'
import path from 'node:path'
import Knex from 'knex'

// Ajusta a tu ruta y config real
import databaseConfig from '#config/database'

export default class ImportMissingBackupData extends BaseCommand {
  public static commandName = 'import:missing-backup-data'
  public static description =
    'Importa únicamente los INSERTs de ciertas tablas que faltan en la DB actual'
  public static settings = {
    loadApp: true,
  }

  // Ajusta la ruta del archivo de backup que quieras leer
  // (Tu “backup antiguo”)
  private sqlFilePath = path.join(process.cwd(), 'basesDatosBackup', 'toizbseh_impulso_main.sql')

  /**
   * Lista de tablas en las que SÍ faltan inserts.
   * (basado en la comparación manual)
   */
  private targetTables = [
    'questions', // padres primero
    'options', // hijas de questions
    'responses', // hijas de options
    'prospects',
    'recommendations',
    'plans_modules',
    'subscriptions',
  ]

  public async run() {
    this.logger.info('Iniciando ImportMissingBackupData...')

    // 1) Leer el archivo .sql de backup
    let fileContent = ''
    try {
      fileContent = fs.readFileSync(this.sqlFilePath, 'utf8')
    } catch (error) {
      this.logger.error(`Error leyendo archivo ${this.sqlFilePath}: ${error.message}`)
      return
    }

    // 2) Extraer únicamente los INSERTs de las tablas que nos interesan
    const statements = this.extractInsertStatements(fileContent, this.targetTables)

    if (!statements.length) {
      this.logger.info('No se encontraron INSERTs para las tablas indicadas o ya están importados.')
      return
    }

    this.logger.info(`Encontradas ${statements.length} sentencias INSERT.`)

    // 3) Crear instancia de Knex con la config de Adonis
    const dbConnectionName = databaseConfig.connection // p. ej. "mysql"
    const connectionSettings = databaseConfig.connections[dbConnectionName]

    const knex = Knex({
      client: connectionSettings.client, // "mysql2", etc.
      connection: connectionSettings.connection,
    })

    // 4) Ejecutar cada sentencia
    for (const stmt of statements) {
      try {
        await knex.raw(stmt)
        this.logger.info(`Insert ejecutado con éxito: ${stmt.substring(0, 80)}...`)
      } catch (error) {
        // Podrías ignorar si ya existe un registro duplicado, o mostrar error.
        this.logger.error(`Error ejecutando insert:\n  ${stmt}\n  => ${error.message}`)
      }
    }

    // 5) Cerrar la conexión
    await knex.destroy()
    this.logger.success('¡Import de datos faltantes completado!')
  }

  /**
   * Método para extraer sentencias INSERT de las tablas indicadas
   */
  private extractInsertStatements(fileContent: string, targetTables: string[]): string[] {
    const lines = fileContent.split('\n')

    // Ejemplo de regex para capturar algo como:
    //   INSERT INTO `options` ...
    //   INSERT INTO `prospects` ...
    const insertRegex = new RegExp(`^INSERT INTO\\s+\`(?:${targetTables.join('|')})\`\\s+.*`, 'i')

    let statements: string[] = []
    let currentStatement = ''
    let capturing = false

    for (let line of lines) {
      if (line.match(insertRegex)) {
        capturing = true
        currentStatement = line
      } else if (capturing) {
        currentStatement += '\n' + line
      }

      if (capturing && line.trim().endsWith(');')) {
        statements.push(currentStatement)
        capturing = false
        currentStatement = ''
      }
    }

    return statements
  }
}

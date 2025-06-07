import { BaseCommand } from '@adonisjs/core/ace'
import fs from 'node:fs'
import path from 'node:path'
import Knex from 'knex'

// Ojo: Ajusta la ruta a donde tengas tu config de DB
import databaseConfig from '#config/database'

export default class ImportSql extends BaseCommand {
  public static commandName = 'import:sql'
  public static description = 'Import partial INSERT statements from a SQL file into AdonisJS DB'
  public static settings = {
    loadApp: true,
  }

  private sqlFilePath = path.join(process.cwd(), 'basesDatosBackup', 'toizbseh_impulso_main.sql')

  public async run() {
    this.logger.info('Starting ImportSql Command...')

    // 1) Leer archivo .sql
    let fileContent = ''
    try {
      fileContent = fs.readFileSync(this.sqlFilePath, 'utf8')
    } catch (error) {
      this.logger.error(`Error reading file at ${this.sqlFilePath}: ${error.message}`)
      return
    }

    // 2) Parsear las sentencias INSERT
    const statements = this.extractInsertStatements(fileContent, ['sedes'])

    if (!statements.length) {
      this.logger.info('No se encontraron sentencias INSERT para las tablas indicadas.')
      return
    }

    this.logger.info(`Found ${statements.length} INSERT statements.`)

    // 3) Crear instancia de Knex con la config de Adonis
    //    (Ajusta la lógica según tu config "connection" y "connections" del databaseConfig)
    const dbConnectionName = databaseConfig.connection // por ej. "mysql"
    const connectionSettings = databaseConfig.connections[dbConnectionName]

    const knex = Knex({
      client: connectionSettings.client, // "mysql2"
      connection: connectionSettings.connection,
    })

    // 4) Ejecutar cada sentencia
    for (const stmt of statements) {
      try {
        await knex.raw(stmt)
        this.logger.info(`Inserted: ${stmt}`)
      } catch (error) {
        this.logger.error(`Error: ${error.message}`)
      }
    }

    // 5) Cerrar la conexión de Knex
    await knex.destroy()

    this.logger.success('Import DONE!')
  }

  /**
   * Extraer y reconstruir sentencias de INSERT para las tablas indicadas
   */
  private extractInsertStatements(fileContent: string, targetTables: string[]): string[] {
    const lines = fileContent.split('\n')
    const insertRegex = new RegExp(`^INSERT INTO\\s+\`(${targetTables.join('|')})\`\\s+.*`, 'i')

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

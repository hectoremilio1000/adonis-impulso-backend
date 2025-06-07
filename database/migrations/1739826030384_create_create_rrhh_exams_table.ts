import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateRrhhExams extends BaseSchema {
  protected tableName = 'rrhh_exams'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Basado en tu tabla "examenes": nombre, tipo, version, activo
      table.string('nombre', 100).notNullable()
      table.string('tipo', 50).notNullable() // Ej: "Conocimientos" o "Psicométrico"
      table.integer('version').unsigned().defaultTo(1)
      table.boolean('activo').defaultTo(true)

      // Fechas estándar de Adonis
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

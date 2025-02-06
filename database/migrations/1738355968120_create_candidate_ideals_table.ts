import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidate_ideals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre', 255).nullable()
      table.string('puesto', 255).nullable()
      table.float('puntaje_bondad').nullable()
      table.float('puntaje_optimismo').nullable()
      table.decimal('puntaje_etica', 5, 2).nullable()
      table.float('puntaje_curiosidad').nullable()
      table.float('puntaje_integridad').nullable()
      table.float('puntaje_autoconciencia').nullable()
      table.float('puntaje_empatia').nullable()
      table.float('puntaje_conocimientos').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

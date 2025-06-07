import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CandidatoIdeal extends BaseSchema {
  protected tableName = 'rrhh_candidato_ideal'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nombre').notNullable()
      table.string('puesto').notNullable()

      table.float('puntaje_bondad').notNullable().defaultTo(0)
      table.float('puntaje_optimismo').notNullable().defaultTo(0)
      table.float('puntaje_etica').notNullable().defaultTo(0)
      table.float('puntaje_curiosidad').notNullable().defaultTo(0)
      table.float('puntaje_integridad').notNullable().defaultTo(0)
      table.float('puntaje_autoconciencia').notNullable().defaultTo(0)
      table.float('puntaje_empatia').notNullable().defaultTo(0)
      table.float('puntaje_conocimientos').notNullable().defaultTo(0)

      table.timestamp('fecha', { useTz: true }).defaultTo(this.now())

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

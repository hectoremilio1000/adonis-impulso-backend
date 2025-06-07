// database/migrations/xxxx_create_positions_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreatePositionsTable extends BaseSchema {
  protected tableName = 'positions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nombre', 255).notNullable()
      table.string('tipo', 100).notNullable().defaultTo('Conocimientos')
      table.integer('version').notNullable().defaultTo(1)
      table.boolean('activo').notNullable().defaultTo(true)

      // Campos de timestamps
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

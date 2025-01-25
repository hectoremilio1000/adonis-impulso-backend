import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'prospects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') //ptrimary kEY
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable()
      table.string('whatsapp', 15).notNullable()
      table.string('status', 255).notNullable()
      table.string('origin', 255).nullable()
      //agregar origen columna
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()) // Created timestamp
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now()) // Updated timestamp
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

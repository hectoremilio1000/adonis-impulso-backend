import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Employees extends BaseSchema {
  protected tableName = 'employees'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
        .notNullable()

      table.string('name', 120).notNullable()
      table.string('email', 120).nullable()
      table.string('phone', 50).nullable()
      table.string('position', 100).nullable() // Puesto o cargo
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

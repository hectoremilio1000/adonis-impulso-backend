// database/migrations/XXXX_AddCreatedByToEmployees.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCreatedByToEmployees extends BaseSchema {
  protected tableName = 'employees'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Agrega la columna created_by
      table
        .integer('created_by')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL') // si borras el user, se pone null
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('created_by')
    })
  }
}

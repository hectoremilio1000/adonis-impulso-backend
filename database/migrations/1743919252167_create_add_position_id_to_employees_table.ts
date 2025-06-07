// database/migrations/xxx_add_position_id_to_employees.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPositionIdToEmployees extends BaseSchema {
  protected tableName = 'employees'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer('position_id')
        .unsigned()
        .references('id')
        .inTable('positions')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('position_id')
    })
  }
}

// database/migrations/NNNN_AddIsActiveToUsers.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddIsActiveToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Agregamos la columna is_active (por defecto, true)
      table.boolean('is_active').notNullable().defaultTo(true)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_active')
    })
  }
}

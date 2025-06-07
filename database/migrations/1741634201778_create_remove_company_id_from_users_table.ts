import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RemoveCompanyIdFromUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Suelta primero la constraint
      table.dropForeign('company_id', 'users_company_id_foreign')

      // Y después elimina la columna
      table.dropColumn('company_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Restaura la columna
      table
        .integer('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
        .after('rol_id')
    })
  }
}

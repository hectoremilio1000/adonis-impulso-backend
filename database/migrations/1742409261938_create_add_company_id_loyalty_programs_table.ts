import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCompanyIdToLoyaltyPrograms extends BaseSchema {
  protected tableName = 'loyalty_programs'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Crea la columna company_id, permitiendo null
      table
        .integer('company_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL') // En caso de que se elimine la compañía, deja el campo en null
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Eliminar la columna company_id
      table.dropColumn('company_id')
    })
  }
}

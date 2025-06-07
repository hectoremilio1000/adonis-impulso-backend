import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LoyaltyRequests extends BaseSchema {
  protected tableName = 'loyalty_requests'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('company_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL')
      // ^ Si quieres que al borrar una company se deje null la foreign key
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('company_id')
    })
  }
}

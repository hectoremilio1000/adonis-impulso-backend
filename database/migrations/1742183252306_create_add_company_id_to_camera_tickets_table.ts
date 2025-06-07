import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCompanyIdToCameraTickets extends BaseSchema {
  protected tableName = 'camera_tickets'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
        .after('user_id') // para ubicarlo justo después de user_id
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('company_id')
    })
  }
}

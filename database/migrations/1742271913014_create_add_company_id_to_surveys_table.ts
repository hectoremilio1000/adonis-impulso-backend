// database/migrations/XXXXXX_add_company_id_to_surveys.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCompanyIdToSurveys extends BaseSchema {
  protected tableName = 'surveys'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL') // o CASCADE, depende de tu lógica
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('company_id')
    })
  }
}

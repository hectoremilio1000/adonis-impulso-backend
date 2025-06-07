// database/migrations/XXXXXX_add_company_id_to_survey_requests.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCompanyIdToSurveyRequests extends BaseSchema {
  protected tableName = 'survey_requests'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Añadimos la columna company_id
      table
        .integer('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('SET NULL') // o CASCADE, según tu lógica
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('company_id')
    })
  }
}

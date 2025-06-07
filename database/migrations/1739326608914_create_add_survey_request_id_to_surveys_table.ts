import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddSurveyRequestIdToSurveys extends BaseSchema {
  protected tableName = 'surveys'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Agrega la columna survey_request_id con FK a survey_requests.id
      table
        .integer('survey_request_id')
        .unsigned()
        .references('id')
        .inTable('survey_requests')
        .onDelete('CASCADE') // <-- Al borrar la solicitud, se borran encuestas relacionadas
        .nullable() // o .notNullable(), según tu caso
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('survey_request_id')
    })
  }
}

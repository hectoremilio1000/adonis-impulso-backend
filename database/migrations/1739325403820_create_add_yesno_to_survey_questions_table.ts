import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddYesnoToSurveyQuestions extends BaseSchema {
  protected tableName = 'survey_questions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Reemplaza el enum anterior agregando 'yesno'
      table.enum('type', ['scale', 'text', 'multiple_choice', 'yesno']).notNullable().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Vuelves al enum original sin 'yesno'
      table.enum('type', ['scale', 'text', 'multiple_choice']).notNullable().alter()
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SurveyAnswers extends BaseSchema {
  protected tableName = 'survey_answers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Cada respuesta está asociada a 1 "response" (quién respondió la encuesta)
      table
        .integer('survey_response_id')
        .unsigned()
        .references('id')
        .inTable('survey_responses')
        .onDelete('CASCADE')
        .notNullable()

      // Y asociada a 1 "question" concreta
      table
        .integer('survey_question_id')
        .unsigned()
        .references('id')
        .inTable('survey_questions')
        .onDelete('CASCADE')
        .notNullable()

      // En caso sea scale=1..10 o multiple_choice (guardas el indice/valor)
      table.integer('answer_number').nullable()

      // En caso sea texto
      table.text('answer_text').nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SurveyQuestions extends BaseSchema {
  protected tableName = 'survey_questions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('survey_id')
        .unsigned()
        .references('id')
        .inTable('surveys')
        .onDelete('CASCADE')
        .notNullable()

      // Texto de la pregunta
      table.text('question_text').notNullable()

      // Tipo: scale (1-10), text (comentario), multiple_choice, etc.
      table.enum('type', ['scale', 'text', 'multiple_choice']).notNullable()

      // Opciones si es multiple_choice (ej: ["Bueno","Regular","Malo"])
      table.json('options_json').nullable()

      // Orden de aparición
      table.integer('order_index').defaultTo(0)

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

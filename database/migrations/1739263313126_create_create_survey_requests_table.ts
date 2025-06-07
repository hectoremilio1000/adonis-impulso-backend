import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SurveyRequests extends BaseSchema {
  protected tableName = 'survey_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      // user_id => quién solicita la encuesta (admin/restaurante)
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.string('title').notNullable()
      // Aquí guardamos temporalmente las preguntas antes de aprobar. Ej: JSON con { type, question_text, ... }
      table.json('questions_json').nullable()

      table.text('notes').nullable()
      // 'pending' | 'approved' | 'rejected'
      table.string('status').defaultTo('pending')

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

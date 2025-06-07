import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SurveyResponses extends BaseSchema {
  protected tableName = 'survey_responses'

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

      // Datos opcionales de la persona que responde
      table.string('customer_name').nullable()
      table.string('customer_email').nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

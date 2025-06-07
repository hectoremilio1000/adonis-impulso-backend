// database/migrations/xxxx_create_questions.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Questions extends BaseSchema {
  protected tableName = 'create_questions_training'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('quiz_id').unsigned().references('quizzes.id').onDelete('CASCADE').notNullable()

      table.text('text').notNullable() // la pregunta en sí
      table.string('type').defaultTo('multiple_choice')
      table.integer('order').defaultTo(1)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

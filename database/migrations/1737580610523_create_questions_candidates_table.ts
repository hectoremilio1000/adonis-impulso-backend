import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'questions_candidates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('exam_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('exams')
        .onDelete('CASCADE')
      table.text('text').notNullable()
      table.decimal('question_weight', 3, 2).notNullable().defaultTo(1.0)

      // Options and their weights
      table.string('option_a', 255).notNullable()
      table.decimal('weight_a', 3, 2).notNullable().defaultTo(0.0)
      table.string('option_b', 255).notNullable()
      table.decimal('weight_b', 3, 2).notNullable().defaultTo(0.0)
      table.string('option_c', 255).notNullable()
      table.decimal('weight_c', 3, 2).notNullable().defaultTo(0.0)
      table.string('option_d', 255).notNullable()
      table.decimal('weight_d', 3, 2).notNullable().defaultTo(0.0)
      table.string('option_e', 255).nullable()
      table.decimal('weight_e', 3, 2).notNullable().defaultTo(0.0)

      table.string('correct_answer', 1).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

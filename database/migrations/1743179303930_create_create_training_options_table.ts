import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Options extends BaseSchema {
  protected tableName = 'training_options'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('question_id')
        .unsigned()
        .references('questions.id')
        .onDelete('CASCADE')
        .notNullable()

      table.string('text').notNullable()
      table.boolean('is_correct').defaultTo(false)

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

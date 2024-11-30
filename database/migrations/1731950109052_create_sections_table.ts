import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.boolean(' active_title').notNullable()
      table.string('description').notNullable()
      table.boolean('active_description').notNullable()
      table.string('image').notNullable()
      table.boolean(' active_image').notNullable()
      table.integer('successcase_id').unsigned().references('id').inTable('successcases')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

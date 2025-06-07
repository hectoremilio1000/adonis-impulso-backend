// database/migrations/xxxx_create_lessons.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Lessons extends BaseSchema {
  protected tableName = 'lessons'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('module_id')
        .unsigned()
        .references('modules.id')
        .onDelete('CASCADE')
        .notNullable()

      table.string('title').notNullable()
      table.text('content').nullable() // o content_url, si quieres
      table.string('content_type').nullable() // 'video', 'pdf', 'text', etc.
      table.integer('order').defaultTo(1)

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class EmployeeLessonProgress extends BaseSchema {
  protected tableName = 'employee_lesson_progress'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('employee_id')
        .unsigned()
        .references('employees.id')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('lesson_id')
        .unsigned()
        .references('lessons.id')
        .onDelete('CASCADE')
        .notNullable()

      table.dateTime('viewed_at').notNullable()

      // si quieres, en vez de viewed_at, un boolean `completed`
      // table.boolean('completed').defaultTo(false)

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

// database/migrations/xxxx_create_employee_module_progress.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class EmployeeModuleProgress extends BaseSchema {
  protected tableName = 'employee_module_progress'

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
        .integer('module_id')
        .unsigned()
        .references('modules.id')
        .onDelete('CASCADE')
        .notNullable()

      table.enum('status', ['not_started', 'in_progress', 'completed']).defaultTo('not_started')

      table.float('score').nullable() // si sacó un puntaje en el quiz
      table.boolean('passed').defaultTo(false)

      table.dateTime('completed_at').nullable()

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

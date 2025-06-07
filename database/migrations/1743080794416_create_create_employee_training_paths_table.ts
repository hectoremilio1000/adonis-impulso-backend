// database/migrations/xxxx_create_employee_training_paths.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class EmployeeTrainingPaths extends BaseSchema {
  protected tableName = 'employee_training_paths'

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
        .integer('training_path_id')
        .unsigned()
        .references('training_paths.id')
        .onDelete('CASCADE')
        .notNullable()

      table.enum('status', ['not_started', 'in_progress', 'completed']).defaultTo('not_started')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

// database/migrations/XXXX_create_plan_changes.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PlanChanges extends BaseSchema {
  protected tableName = 'plan_changes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('subscription_id')
        .unsigned()
        .references('id')
        .inTable('subscriptions')
        .notNullable()
      table.integer('old_plan_id').unsigned().references('id').inTable('plans')
      table.integer('new_plan_id').unsigned().references('id').inTable('plans')
      table.timestamp('changed_at', { useTz: true }).notNullable()

      // si quieres relacionarlo con user, p.ej. userId:
      table.integer('user_id').unsigned().references('id').inTable('users')

      table.timestamps(true) // created_at, updated_at
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

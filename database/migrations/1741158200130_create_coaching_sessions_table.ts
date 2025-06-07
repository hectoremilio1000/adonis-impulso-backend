import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CoachingSessions extends BaseSchema {
  protected tableName = 'coaching_sessions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('subscription_id')
        .unsigned()
        .references('id')
        .inTable('subscriptions')
        .onDelete('CASCADE')
      table.dateTime('session_date').notNullable()
      table.enum('type', ['presencial', 'virtual']).notNullable()
      table.decimal('hours', 5, 2).notNullable().defaultTo(1.0) // o int si quieres
      table.timestamps(true, true) // created_at, updated_at
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

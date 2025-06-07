import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SubscriptionModules extends BaseSchema {
  protected tableName = 'subscription_modules'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('subscription_id')
        .unsigned()
        .references('id')
        .inTable('subscriptions')
        .onDelete('CASCADE')
      table.integer('module_id').unsigned().references('id').inTable('modules').onDelete('CASCADE')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

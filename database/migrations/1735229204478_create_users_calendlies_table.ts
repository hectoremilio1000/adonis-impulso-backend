import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_calendlies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('calendly_uid').unique().notNullable()
      table.string('access_token').notNullable()
      table.string('refresh_token').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

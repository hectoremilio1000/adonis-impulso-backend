import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('email').nullable()
      table.string('logo').nullable()
      table.string('website').nullable()
      table.string('phone_contact').nullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('created_by').unsigned().references('id').inTable('users')

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

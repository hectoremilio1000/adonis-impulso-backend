import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LoyaltyPrograms extends BaseSchema {
  protected tableName = 'loyalty_programs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.enum('type', ['visits', 'products']).notNullable()
      table.integer('required_visits').nullable() // para programas “visits”
      table.integer('required_products').nullable() // para programas “products”
      table.string('reward_description').nullable()
      table.boolean('is_active').defaultTo(true)

      // created_at, updated_at (auto)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

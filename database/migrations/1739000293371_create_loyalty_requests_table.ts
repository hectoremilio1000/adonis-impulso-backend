import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LoyaltyRequests extends BaseSchema {
  protected tableName = 'loyalty_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      // "program_type" => "visits" o "products"
      table.enum('program_type', ['visits', 'products']).notNullable()

      // Para saber cuántas visitas o productos se requieren
      table.integer('required_visits').nullable()
      table.integer('required_products').nullable()

      // Descripción del premio
      table.string('reward_description').nullable()

      // Estado "pending", "approved", "rejected"
      table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending')

      // Notas adicionales
      table.text('notes').nullable()

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

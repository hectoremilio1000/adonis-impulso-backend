import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transacctions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('subscription_id').unsigned().references('id').inTable('subscriptions')
      table
        .enum('method_payment', [
          'cash',
          'mercado_pago',
          'bank_trans',
          'credit_card',
          'debit_card',
          'paypal',
          'stripe',
          'cryptocurrency',
          'check',
          'mobile_payment',
        ])
        .notNullable()
      table.enum('status', ['pending', 'completed', 'failed']).notNullable()
      table.string('transaction_number', 100).nullable()
      table.decimal('amount', 10, 2).notNullable()
      table.dateTime('payment_date').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

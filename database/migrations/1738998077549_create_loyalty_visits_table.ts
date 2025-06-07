import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LoyaltyVisits extends BaseSchema {
  protected tableName = 'loyalty_visits'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('card_id').unsigned().references('loyalty_cards.id').onDelete('CASCADE')
      table.dateTime('visit_date').defaultTo(this.now()) // o colócalo nullable
      table.text('notes').nullable()

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

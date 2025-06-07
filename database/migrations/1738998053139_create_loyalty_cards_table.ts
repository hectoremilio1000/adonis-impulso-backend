import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LoyaltyCards extends BaseSchema {
  protected tableName = 'loyalty_cards'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('program_id').unsigned().references('loyalty_programs.id').onDelete('CASCADE') // si borras un program, borra sus cards
      table.string('code').notNullable().unique() // el slug o token de QR
      table.integer('visits_count').defaultTo(0)
      table.integer('products_count').defaultTo(0)
      table.integer('redemptions_count').defaultTo(0)
      table.boolean('is_active').defaultTo(true)

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

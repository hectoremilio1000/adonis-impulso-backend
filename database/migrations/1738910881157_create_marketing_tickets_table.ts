import { BaseSchema } from '@adonisjs/lucid/schema'

export default class MarketingTickets extends BaseSchema {
  protected tableName = 'marketing_tickets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // si el usuario se borra, se borran sus tickets
      table.string('campaign_type').notNullable() // "Google", "TikTok", "Meta"
      table.text('objective').notNullable() // Descripción del objetivo
      table.decimal('budget', 10, 2).defaultTo(0) // presupuesto
      table
        .enum('status', ['new', 'in_progress', 'completed', 'cancelled', 'rejected'])
        .defaultTo('new')
      table.json('attachments').nullable() // Para guardar un array de archivos si quieres
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

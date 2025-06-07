// file: database/migrations/xxxx_legal_tickets.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class LegalTickets extends BaseSchema {
  protected tableName = 'legal_tickets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('subject').notNullable()
      table.text('description').notNullable()
      table.string('status').defaultTo('new') // "new", "in_progress", etc.

      // Para MySQL, mejor usar JSON si quieres guardar un array
      table.json('attachments').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

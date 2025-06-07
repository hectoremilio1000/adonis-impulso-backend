import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Requests extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('title', 255).notNullable()
      table.text('description', 'long') // 'long' para texto más grande
      table.enum('status', ['pending', 'in_progress', 'completed', 'rejected']).defaultTo('pending')
      table.json('attachments').nullable() // Para guardar rutas de imágenes u otros archivos (opcional)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

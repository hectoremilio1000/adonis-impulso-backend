// file: database/migrations/9999999999999_punto_venta_tickets.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PuntoVentaTickets extends BaseSchema {
  protected tableName = 'punto_venta'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relación con usuarios (FK)
      table.integer('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')

      table.string('titulo_problema', 255).notNullable()
      table.text('descripcion_problema').notNullable()

      table.enum('urgencia', ['baja', 'media', 'alta']).defaultTo('baja')
      table.string('whatsapp', 20).nullable()

      // Aquí almacenamos la ruta (o JSON si gustas) de la foto
      // Si deseas un array de fotos, podrías hacer table.json('foto').nullable()
      table.string('foto', 255).nullable()

      table
        .enum('status', ['new', 'in_progress', 'completed', 'cancelled', 'rejected'])
        .defaultTo('new')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

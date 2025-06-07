import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FinancingRequests extends BaseSchema {
  protected tableName = 'financing_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // si borras el user, se borran sus solicitudes
        .notNullable()

      // Monto solicitado
      table.decimal('amount', 12, 2).notNullable()

      // Razón o descripción (para comprar máquina, crecer negocio, etc.)
      table.text('reason').notNullable()

      // Estado de la solicitud
      // pending | approved | rejected | etc.
      table.string('status').defaultTo('pending')

      // Tasa de interés (puede ser nula si no está aprobada)
      table.decimal('interest_rate', 5, 2).nullable() // Ej: 12.5

      // Monto finalmente aprobado (si difiere del que pidió)
      table.decimal('approved_amount', 12, 2).nullable()

      // Posibles campos de fechas o pagos
      table.date('start_date').nullable()
      table.date('end_date').nullable()
      table.decimal('monthly_payment', 12, 2).nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

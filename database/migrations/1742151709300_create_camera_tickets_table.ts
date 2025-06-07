import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CameraTickets extends BaseSchema {
  protected tableName = 'camera_tickets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('subject').notNullable() // Título o asunto del ticket
      table.text('description').notNullable() // Descripción detallada de la solicitud
      table.string('camera_name').nullable() // Nombre o identificación de la cámara (opcional)
      table.timestamp('start_time').nullable() // Momento de inicio a revisar
      table.timestamp('end_time').nullable() // Momento de fin a revisar

      // Estado del ticket: new, in_progress, resolved, cancelled, etc.
      table.string('status').defaultTo('new').notNullable()

      // Campo para guardar la resolución o conclusión del caso, si aplica
      table.text('resolution').nullable()

      // Si quieres guardar adjuntos (JSON con rutas a videos o imágenes):
      table.json('attachments').nullable()

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

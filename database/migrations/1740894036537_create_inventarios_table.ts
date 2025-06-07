// database/migrations/xxxx_xx_xx_xxxxxx_inventarios.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Inventarios extends BaseSchema {
  protected tableName = 'inventarios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // id autoincremental
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('title', 255).notNullable()
      table.text('description').nullable() // si necesitas descripción adicional
      // Puedes almacenar la selección de “un producto”, “varios” o “todos”
      table.string('tipo_inventario', 50).notNullable() // "un_producto", "varios", "todos"
      table.string('priority', 50).notNullable().defaultTo('normal') // "baja", "media", "alta"

      // status: "pending", "in_progress", "completed", "rejected", etc.
      table.string('status', 50).defaultTo('pending')

      // attachments en formato JSON
      table.text('attachments', 'longtext').nullable() // lo almacenamos como JSON string

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

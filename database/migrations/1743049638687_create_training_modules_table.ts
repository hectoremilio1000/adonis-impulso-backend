// database/migrations/xxxx_create_modules.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Modules extends BaseSchema {
  protected tableName = 'training_modules'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('training_path_id')
        .unsigned()
        .references('training_paths.id')
        .onDelete('CASCADE')
        .notNullable()

      table.string('title').notNullable() // e.g. "Introducción al servicio al cliente"
      table.text('description').nullable() // breve texto

      table.integer('order').defaultTo(1) // Para el orden en la ruta

      // Si luego quieres permitir que un module sea global (sin path),
      // se haría un pivot N:M, pero de momento lo dejamos 1:N

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

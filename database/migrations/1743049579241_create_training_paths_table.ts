import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TrainingPaths extends BaseSchema {
  protected tableName = 'training_paths'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable() // e.g.: "Ruta de capacitación de Meseros"
      table.text('description').nullable()
      // Indica para qué rol es. Podrías usar rol_id (num) o un string "mesero"
      table.string('role_name').nullable()

      // Si vas a permitir que sea privado de una empresa o global
      table
        .integer('company_id')
        .unsigned()
        .references('companies.id')
        .onDelete('CASCADE')
        .nullable()

      table.timestamps(true, true) // created_at, updated_at
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

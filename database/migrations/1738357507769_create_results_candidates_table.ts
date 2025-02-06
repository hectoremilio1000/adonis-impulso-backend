import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'results_candidates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('candidate_id').notNullable()
      table.string('puesto', 50).notNullable()
      table.decimal('puntaje_bondad', 5, 2).nullable()
      table.decimal('puntaje_optimismo', 5, 2).nullable()
      table.decimal('puntaje_etica', 5, 2).nullable()
      table.decimal('puntaje_curiosidad', 5, 2).nullable()
      table.decimal('puntaje_integridad', 5, 2).nullable()
      table.decimal('puntaje_autoconciencia', 5, 2).nullable()
      table.decimal('puntaje_empatia', 5, 2).nullable()
      table.decimal('puntaje_conocimientos', 5, 2).nullable()
      table.integer('bondad_examen_id').nullable()
      table.integer('bondad_version').nullable()
      table.integer('optimismo_examen_id').nullable()
      table.integer('optimismo_version').nullable()
      table.integer('etica_examen_id').nullable()
      table.integer('etica_version').nullable()
      table.integer('curiosidad_examen_id').nullable()
      table.integer('curiosidad_version').nullable()
      table.integer('integridad_examen_id').nullable()
      table.integer('integridad_version').nullable()
      table.integer('autoconciencia_examen_id').nullable()
      table.integer('autoconciencia_version').nullable()
      table.integer('empatia_examen_id').nullable()
      table.integer('empatia_version').nullable()
      table.integer('conocimientos_examen_id').nullable()
      table.integer('conocimientos_version').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

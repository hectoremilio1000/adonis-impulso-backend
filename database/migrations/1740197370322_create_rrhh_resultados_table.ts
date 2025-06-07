import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RrhhResultados extends BaseSchema {
  protected tableName = 'rrhh_resultados'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('candidato_id').unsigned().notNullable()
      table.string('puesto').notNullable()

      // Puntajes psicométricos
      table.decimal('puntaje_bondad', 5, 2).defaultTo(0)
      table.decimal('puntaje_optimismo', 5, 2).defaultTo(0)
      table.decimal('puntaje_etica', 5, 2).defaultTo(0)
      table.decimal('puntaje_curiosidad', 5, 2).defaultTo(0)
      table.decimal('puntaje_integridad', 5, 2).defaultTo(0)
      table.decimal('puntaje_autoconciencia', 5, 2).defaultTo(0)
      table.decimal('puntaje_empatia', 5, 2).defaultTo(0)

      // Puntaje Conocimientos (según puesto)
      table.decimal('puntaje_conocimientos', 5, 2).defaultTo(0)

      // (Opcional) Puedes guardar IDs y version de cada examen, p.e.:
      table.integer('bondad_examen_id').unsigned().nullable()
      table.string('bondad_version').nullable()
      table.integer('optimismo_examen_id').unsigned().nullable()
      table.string('optimismo_version').nullable()
      table.integer('etica_examen_id').unsigned().nullable()
      table.string('etica_version').nullable()
      table.integer('curiosidad_examen_id').unsigned().nullable()
      table.string('curiosidad_version').nullable()
      table.integer('integridad_examen_id').unsigned().nullable()
      table.string('integridad_version').nullable()
      table.integer('autoconciencia_examen_id').unsigned().nullable()
      table.string('autoconciencia_version').nullable()
      table.integer('empatia_examen_id').unsigned().nullable()
      table.string('empatia_version').nullable()
      table.integer('conocimientos_examen_id').unsigned().nullable()
      table.string('conocimientos_version').nullable()

      // Fecha
      table.timestamp('fecha', { useTz: true }).notNullable().defaultTo(this.now())

      table.timestamps(true) // created_at, updated_at
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateRrhhPreguntas extends BaseSchema {
  protected tableName = 'rrhh_preguntas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relación con rrhh_exams (examen_id)
      table
        .integer('examen_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('rrhh_exams')
        .onDelete('CASCADE')

      // Campos principales
      table.text('texto').notNullable() // Ej: "¿Qué hacer si...?"
      table.float('peso_pregunta').defaultTo(1.0)

      // Opciones A, B, C, D, E + pesos
      table.string('a', 255).nullable()
      table.float('peso_a').defaultTo(0)

      table.string('b', 255).nullable()
      table.float('peso_b').defaultTo(0)

      table.string('c', 255).nullable()
      table.float('peso_c').defaultTo(0)

      table.string('d', 255).nullable()
      table.float('peso_d').defaultTo(0)

      table.string('e', 255).nullable()
      table.float('peso_e').defaultTo(0)

      // Respuesta correcta (por ejemplo 'a','b','c','d','e')
      table.string('respuesta_correcta', 1).notNullable()

      // Fechas estándar
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

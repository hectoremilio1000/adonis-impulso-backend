import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateRrhhRespuestas extends BaseSchema {
  protected tableName = 'rrhh_respuestas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relación con candidates (candidato_id)
      // asumiendo que tu tabla de candidatos se llama "candidates"
      table
        .integer('candidato_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')

      // Relación con rrhh_preguntas (pregunta_id)
      table
        .integer('pregunta_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('rrhh_preguntas')
        .onDelete('CASCADE')

      // Respuesta seleccionada (a, b, c, d, e, etc.)
      table.string('respuesta_seleccionada', 1).notNullable()

      // Peso de la respuesta (por ejemplo 0.2, 1.0, etc.)
      table.float('peso_respuesta').defaultTo(0)

      // Indica si la respuesta fue correcta
      table.boolean('es_correcta').defaultTo(false)

      // Identificador de intento (por si un candidato hace varios intentos)
      table.integer('intento_id').unsigned().defaultTo(1)

      // Momento en que se respondió
      // (puedes usar created_at, pero si tu tabla necesita "timestamp" específico)
      table.timestamp('timestamp', { useTz: true }).defaultTo(this.now())

      // Relación con rrhh_exams (examen_id) - opcional
      table
        .integer('examen_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('rrhh_exams')
        .onDelete('CASCADE')

      // nombre_examen y version_examen (si deseas guardar copia en la respuesta)
      table.string('nombre_examen', 100).nullable()
      table.integer('version_examen').unsigned().defaultTo(1)

      // peso_pregunta (por si lo registras directamente en la respuesta)
      table.float('peso_pregunta').defaultTo(1.0)

      // Fechas estándar de Adonis
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

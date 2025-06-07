import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import RrhhExam from './rrhh_exam.js'
import RrhhRespuesta from './rrhh_respuesta.js'

export default class RrhhPregunta extends BaseModel {
  public static table = 'rrhh_preguntas'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare examen_id: number

  @column()
  declare texto: string

  @column()
  declare peso_pregunta: number

  @column()
  declare a: string | null

  @column()
  declare peso_a: number

  @column()
  declare b: string | null

  @column()
  declare peso_b: number

  @column()
  declare c: string | null

  @column()
  declare peso_c: number

  @column()
  declare d: string | null

  @column()
  declare peso_d: number

  @column()
  declare e: string | null

  @column()
  declare peso_e: number

  @column()
  declare respuesta_correcta: string // 'a', 'b', 'c', 'd', 'e'

  // Relación: cada pregunta pertenece a un examen
  @belongsTo(() => RrhhExam, {
    foreignKey: 'examen_id',
  })
  declare examen: BelongsTo<typeof RrhhExam>

  // Relación: una pregunta puede tener muchas respuestas
  @hasMany(() => RrhhRespuesta, {
    foreignKey: 'pregunta_id',
  })
  declare respuestas: HasMany<typeof RrhhRespuesta>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

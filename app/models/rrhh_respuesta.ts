import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Candidate from './candidate.js'
import RrhhPregunta from './rrhh_pregunta.js'
import RrhhExam from './rrhh_exam.js'

export default class RrhhRespuesta extends BaseModel {
  public static table = 'rrhh_respuestas'

  @column({ isPrimary: true })
  declare id: number

  // FK al candidato
  @column()
  declare candidato_id: number

  // FK a la pregunta
  @column()
  declare pregunta_id: number

  @column()
  declare respuesta_seleccionada: string // 'a', 'b', etc.

  @column()
  declare peso_respuesta: number

  @column()
  declare es_correcta: number

  @column()
  declare intento_id: number

  // Adicional: timestamp => lo podrías mapear con createdAt si quieres
  // pero aquí se define como un campo aparte
  @column.dateTime()
  declare timestamp: DateTime

  // FK a exam
  @column()
  declare examen_id: number | null

  @column()
  declare nombre_examen: string | null

  @column()
  declare version_examen: number | null

  @column()
  declare peso_pregunta: number

  // belongsTo
  @belongsTo(() => Candidate, {
    foreignKey: 'candidato_id',
  })
  declare candidato: BelongsTo<typeof Candidate>

  @belongsTo(() => RrhhPregunta, {
    foreignKey: 'pregunta_id',
  })
  declare pregunta: BelongsTo<typeof RrhhPregunta>

  @belongsTo(() => RrhhExam, {
    foreignKey: 'examen_id',
  })
  declare examen: BelongsTo<typeof RrhhExam>

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

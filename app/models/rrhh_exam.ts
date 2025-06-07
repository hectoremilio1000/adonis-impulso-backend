import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RrhhPregunta from './rrhh_pregunta.js'

export default class RrhhExam extends BaseModel {
  // Nombre de la tabla
  public static table = 'rrhh_exams'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare tipo: string // "Conocimientos" o "Psicométrico"

  @column()
  declare version: number

  @column()
  declare activo: boolean

  // Relación: un examen tiene muchas preguntas
  @hasMany(() => RrhhPregunta, {
    foreignKey: 'examen_id', // la FK en RrhhPregunta
  })
  declare preguntas: HasMany<typeof RrhhPregunta>

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

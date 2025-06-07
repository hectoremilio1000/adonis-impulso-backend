import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CandidatoIdeal extends BaseModel {
  public static table = 'rrhh_candidato_ideal'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare puesto: string

  @column()
  declare puntaje_bondad: number

  @column()
  declare puntaje_optimismo: number

  @column()
  declare puntaje_etica: number

  @column()
  declare puntaje_curiosidad: number

  @column()
  declare puntaje_integridad: number

  @column()
  declare puntaje_autoconciencia: number

  @column()
  declare puntaje_empatia: number

  @column()
  declare puntaje_conocimientos: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare fecha: DateTime
}

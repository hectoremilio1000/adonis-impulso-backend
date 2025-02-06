import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ResultCandidate extends BaseModel {
  public static table = 'results_candidates'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare candidateId: number

  @column()
  declare puesto: string

  @column()
  declare puntajeBondad?: number

  @column()
  declare puntajeOptimismo?: number

  @column()
  declare puntajeEtica?: number

  @column()
  declare puntajeCuriosidad?: number

  @column()
  declare puntajeIntegridad?: number

  @column()
  declare puntajeAutoconciencia?: number

  @column()
  declare puntajeEmpatia?: number

  @column()
  declare puntajeConocimientos?: number

  @column()
  declare bondadExamenId?: number

  @column()
  declare bondadVersion?: number

  @column()
  declare optimismoExamenId?: number

  @column()
  declare optimismoVersion?: number

  @column()
  declare eticaExamenId?: number

  @column()
  declare eticaVersion?: number

  @column()
  declare curiosidadExamenId?: number

  @column()
  declare curiosidadVersion?: number

  @column()
  declare integridadExamenId?: number

  @column()
  declare integridadVersion?: number

  @column()
  declare autoconcienciaExamenId?: number

  @column()
  declare autoconcienciaVersion?: number

  @column()
  declare empatiaExamenId?: number

  @column()
  declare empatiaVersion?: number

  @column()
  declare conocimientosExamenId?: number

  @column()
  declare conocimientosVersion?: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

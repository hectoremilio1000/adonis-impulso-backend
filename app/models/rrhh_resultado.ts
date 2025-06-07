// file: app/Models/RrhhResultado.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RrhhResultado extends BaseModel {
  // Ajusta si tu tabla real se llama 'resultados', 'rrhh_resultado', etc.
  public static table = 'rrhh_resultados'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare candidato_id: number

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
  declare intento_id: number | null

  @column()
  declare puntaje_integridad: number

  @column()
  declare puntaje_autoconciencia: number

  @column()
  declare puntaje_empatia: number

  @column()
  declare puntaje_conocimientos: number

  // Si tu tabla tiene una columna tipo DATETIME/TIMESTAMP para 'fecha'
  @column.dateTime()
  declare fecha: DateTime

  // Examen IDs / version (ajusta a number | null o string | null según tu DB)
  @column()
  declare bondad_examen_id: number | null

  @column()
  declare bondad_version: string | null

  @column()
  declare optimismo_examen_id: number | null

  @column()
  declare optimismo_version: string | null

  @column()
  declare etica_examen_id: number | null

  @column()
  declare etica_version: string | null

  @column()
  declare curiosidad_examen_id: number | null

  @column()
  declare curiosidad_version: string | null

  @column()
  declare integridad_examen_id: number | null

  @column()
  declare integridad_version: string | null

  @column()
  declare autoconciencia_examen_id: number | null

  @column()
  declare autoconciencia_version: string | null

  @column()
  declare empatia_examen_id: number | null

  @column()
  declare empatia_version: string | null

  @column()
  declare conocimientos_examen_id: number | null

  @column()
  declare conocimientos_version: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

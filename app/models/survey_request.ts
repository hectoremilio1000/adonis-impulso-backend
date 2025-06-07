import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Company from './company.js'

export default class SurveyRequest extends BaseModel {
  // Nombre explícito de la tabla
  public static table = 'survey_requests'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare company_id: number | null

  @column()
  declare title: string

  // Aquí se guardan las preguntas en JSON antes de aprobar.
  // Ejemplo: [{ type: 'scale', question_text: '¿Calif. 1-10?', ... }, ...]
  @column()
  declare questions_json: any | null

  @column()
  declare notes: string | null

  // 'pending' | 'approved' | 'rejected'
  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Company, {
    foreignKey: 'company_id',
  })
  declare company: BelongsTo<typeof Company>
}

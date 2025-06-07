import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Survey from './survey.js'

export default class SurveyQuestion extends BaseModel {
  public static table = 'survey_questions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare survey_id: number

  @column()
  declare question_text: string

  // 'scale' | 'text' | 'multiple_choice' (según tu migración)
  @column()
  declare type: string

  // Si es multiple_choice, aquí guardamos las opciones (JSON)
  @column()
  declare options_json: any | null

  // Orden en que se muestra la pregunta
  @column()
  declare order_index: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Survey, {
    foreignKey: 'survey_id',
  })
  declare survey: BelongsTo<typeof Survey>
}

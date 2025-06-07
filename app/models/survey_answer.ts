import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SurveyResponse from './survey_response.js'
import SurveyQuestion from './survey_question.js'

export default class SurveyAnswer extends BaseModel {
  public static table = 'survey_answers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare survey_response_id: number

  @column()
  declare survey_question_id: number

  // Si la respuesta es numérica (scale 1-10, multiple choice index, etc.)
  @column()
  declare answer_number: number | null

  // Si la respuesta es texto libre
  @column()
  declare answer_text: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => SurveyResponse, {
    foreignKey: 'survey_response_id',
  })
  declare response: BelongsTo<typeof SurveyResponse>

  @belongsTo(() => SurveyQuestion, {
    foreignKey: 'survey_question_id',
  })
  declare question: BelongsTo<typeof SurveyQuestion>
}

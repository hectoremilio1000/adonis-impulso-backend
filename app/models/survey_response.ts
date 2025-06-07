import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Survey from './survey.js'
import SurveyAnswer from './survey_answer.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class SurveyResponse extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare survey_id: number

  @column()
  declare customer_name: string | null

  @column()
  declare customer_email: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // belongsTo => para acceder a la encuesta (1 SurveyResponse pertenece a 1 Survey)
  @belongsTo(() => Survey, {
    foreignKey: 'survey_id',
  })
  declare survey: BelongsTo<typeof Survey>

  // hasMany => para acceder a las Answers (1 SurveyResponse tiene muchas SurveyAnswers)
  @hasMany(() => SurveyAnswer, {
    foreignKey: 'survey_response_id',
  })
  declare answers: HasMany<typeof SurveyAnswer>
}

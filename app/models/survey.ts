import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import SurveyQuestion from './survey_question.js'
import SurveyResponse from './survey_response.js'
import SurveyRequest from './survey_request.js'
import Company from './company.js'

export default class Survey extends BaseModel {
  public static table = 'surveys'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare title: string

  @column()
  declare code: string

  @column()
  declare company_id: number | null

  @column()
  declare survey_request_id: number | null

  @column()
  declare is_active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  // Relación 1:N con SurveyQuestion
  @hasMany(() => SurveyQuestion, {
    foreignKey: 'survey_id',
  })
  declare questions: HasMany<typeof SurveyQuestion>

  @belongsTo(() => SurveyRequest, {
    foreignKey: 'survey_request_id',
  })
  declare surveyRequest: BelongsTo<typeof SurveyRequest>

  // Relación 1:N con SurveyResponse
  @hasMany(() => SurveyResponse, {
    foreignKey: 'survey_id',
  })
  declare responses: HasMany<typeof SurveyResponse>

  @belongsTo(() => Company, {
    foreignKey: 'company_id',
  })
  declare company: BelongsTo<typeof Company>
}

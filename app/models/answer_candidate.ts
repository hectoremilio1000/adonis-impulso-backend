import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AnswerCandidate extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare candidate_id: number

  @column()
  declare exam_id: number

  @column()
  declare question_id: number

  @column()
  declare selected_answer: string

  @column()
  declare answer_weight: string

  @column()
  declare is_correct: boolean

  @column()
  declare attempt: number

  @column()
  declare max_attempt: number

  @column()
  declare exam_name: string

  @column()
  declare exam_version: number

  @column()
  declare question_weight: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

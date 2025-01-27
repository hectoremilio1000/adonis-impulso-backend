import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Answer from './answer.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class QuestionCandidate extends BaseModel {
  public static table = 'questions_candidates'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare exam_id: number

  @column()
  declare text: string

  @column()
  declare question_weight: number

  @column()
  declare option_a: string

  @column()
  declare weight_a: number

  @column()
  declare option_b: string

  @column()
  declare weight_b: number

  @column()
  declare option_c: string

  @column()
  declare weight_c: number

  @column()
  declare option_d: string

  @column()
  declare weight_d: number

  @column()
  declare option_e: string | null

  @column()
  declare weight_e: number

  @column()
  declare correct_answer: 'A' | 'B' | 'C' | 'D' | 'E'

  @hasMany(() => Answer, {
    foreignKey: 'question_id',
  })
  declare answers: HasMany<typeof Answer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

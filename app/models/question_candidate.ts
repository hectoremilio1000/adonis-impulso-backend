import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Answer from './answer.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Exam from './exam.js'

export default class QuestionCandidate extends BaseModel {
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

  @belongsTo(() => Exam, {
    foreignKey: 'exam_id',
  })
  declare exam: BelongsTo<typeof Exam>

  @hasMany(() => Answer, {
    foreignKey: 'question_id',
  })
  declare answers: HasMany<typeof Answer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import QuestionCandidate from './question_candidate.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Exam extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: string

  @hasMany(() => QuestionCandidate, {
    foreignKey: 'exam_id',
  })
  declare questions_candidates: HasMany<typeof QuestionCandidate>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

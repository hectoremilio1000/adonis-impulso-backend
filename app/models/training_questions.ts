// app/Models/Question.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Quiz from './training_quiz.js'
import Option from './training_option.js'

export default class Question extends BaseModel {
  public static table = 'training_questions'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'quiz_id' })
  declare quizId: number

  @belongsTo(() => Quiz, {
    foreignKey: 'quiz_id',
  })
  declare quiz: BelongsTo<typeof Quiz>

  @column()
  declare text: string

  @column()
  declare type: string // 'multiple_choice', etc.

  @column()
  declare order: number

  @hasMany(() => Option, {
    foreignKey: 'questionId',
  })
  declare options: HasMany<typeof Option>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

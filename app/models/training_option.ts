// app/Models/Option.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Question from './training_questions.js'

export default class Option extends BaseModel {
  public static table = 'training_options'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'question_id' })
  declare questionId: number

  @belongsTo(() => Question, {
    foreignKey: 'question_id',
  })
  declare question: BelongsTo<typeof Question>

  @column()
  declare text: string

  @column()
  declare isCorrect: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

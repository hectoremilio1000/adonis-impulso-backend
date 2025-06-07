// app/Models/Quiz.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Module from './training_module.js'
import Question from './training_questions.js'

export default class Quiz extends BaseModel {
  public static table = 'training_quizzes'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'module_id' })
  declare moduleId: number

  @belongsTo(() => Module, {
    foreignKey: 'module_id',
  })
  declare module: BelongsTo<typeof Module>

  @column()
  declare passingScore: number

  @hasMany(() => Question, {
    foreignKey: 'quizId',
  })
  declare questions: HasMany<typeof Question>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

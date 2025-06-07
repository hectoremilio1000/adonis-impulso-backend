// app/Models/Module.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TrainingPath from './training_path.js'
import Lesson from './training_lesson.js'

export default class Module extends BaseModel {
  public static table = 'training_modules'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'training_path_id' })
  declare trainingPathId: number

  @belongsTo(() => TrainingPath, {
    foreignKey: 'training_path_id',
  })
  declare trainingPath: BelongsTo<typeof TrainingPath>

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Lesson, {
    foreignKey: 'moduleId',
  })
  declare lessons: HasMany<typeof Lesson>
}

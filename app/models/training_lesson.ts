// app/Models/Lesson.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Module from './training_module.js'

export default class Lesson extends BaseModel {
  public static table = 'training_lessons'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'module_id' })
  declare moduleId: number

  @belongsTo(() => Module, {
    foreignKey: 'module_id',
  })
  declare module: BelongsTo<typeof Module>

  @column()
  declare title: string

  @column()
  declare content: string | null

  @column()
  declare contentType: string | null // 'video','pdf','text', etc.

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Option from './option.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare statement: string

  @column()
  declare context: string | null

  @hasMany(() => Option, {
    foreignKey: 'question_id',
  })
  declare options: HasMany<typeof Option>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

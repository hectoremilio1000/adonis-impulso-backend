import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Option from './option.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Response extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare prospect_id: number

  @column()
  declare option_id: number

  @belongsTo(() => Option, {
    foreignKey: 'option_id',
  })
  declare options: BelongsTo<typeof Option>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

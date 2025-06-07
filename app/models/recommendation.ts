import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Prospect from './prospect.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Recommendation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare prospect_id: number | null

  @column()
  declare user_id: number | null

  // Texto generado por la IA
  @column()
  declare text: string

  @belongsTo(() => Prospect, {
    foreignKey: 'prospect_id',
  })
  declare prospect: BelongsTo<typeof Prospect>

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

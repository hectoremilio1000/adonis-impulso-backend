import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class FinancingRequest extends BaseModel {
  public static table = 'financing_requests'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare amount: number

  @column()
  declare reason: string

  @column()
  declare status: string

  @column()
  declare interest_rate: number | null

  @column()
  declare approved_amount: number | null

  @column.date()
  declare start_date: DateTime | null

  @column.date()
  declare end_date: DateTime | null

  @column()
  declare monthly_payment: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import LoyaltyCard from './loyalty_card.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class LoyaltyVisit extends BaseModel {
  public static table = 'loyalty_visits'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare card_id: number

  @column.dateTime()
  declare visit_date: DateTime

  @column()
  declare notes: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => LoyaltyCard)
  declare card: BelongsTo<typeof LoyaltyCard>
}

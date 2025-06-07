import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'

export default class LoyaltyRequest extends BaseModel {
  public static table = 'loyalty_requests'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare program_type: 'visits' | 'products'

  @column()
  declare company_id: number | null

  @column()
  declare required_visits: number | null

  @column()
  declare required_products: number | null

  @column()
  declare reward_description: string | null

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column()
  declare notes: string | null

  @belongsTo(() => User, {
    foreignKey: 'user_id', // la columna en loyalty_requests
  })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Company, {
    foreignKey: 'company_id',
  })
  declare company: BelongsTo<typeof Company>
}

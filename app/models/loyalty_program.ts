import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import LoyaltyCard from './loyalty_card.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Company from './company.js'

export default class LoyaltyProgram extends BaseModel {
  public static table = 'loyalty_programs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number // el restaurante “dueño”

  @column()
  declare name: string

  @column()
  declare company_id: number | null // Relación con la tabla "companies"

  @column()
  declare type: 'visits' | 'products'

  @column()
  declare required_visits: number | null

  @column()
  declare required_products: number | null

  @column()
  declare reward_description: string | null

  @column()
  declare is_active: boolean

  @belongsTo(() => User, {
    foreignKey: 'user_id', // la columna en loyalty_programs
  })
  declare owner: BelongsTo<typeof User>

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => LoyaltyCard)
  declare cards: HasMany<typeof LoyaltyCard>

  @belongsTo(() => Company, {
    foreignKey: 'company_id',
  })
  declare company: BelongsTo<typeof Company>
}

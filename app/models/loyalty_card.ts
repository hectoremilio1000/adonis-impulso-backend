import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import LoyaltyProgram from './loyalty_program.js'
import LoyaltyVisit from './loyalty_visit.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class LoyaltyCard extends BaseModel {
  public static table = 'loyalty_cards'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare program_id: number

  @column()
  declare user_id: number | null

  // Nombre de un cliente final, si no lo tienes en users
  @column()
  declare customer_name: string | null

  @column()
  declare code: string

  @column()
  declare visits_count: number

  @column()
  declare products_count: number

  @column()
  declare redemptions_count: number

  @column()
  declare is_active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => LoyaltyProgram, {
    foreignKey: 'program_id',
  })
  declare program: BelongsTo<typeof LoyaltyProgram>

  // belongsTo => si usas user_id como "cliente final"
  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  // Si tienes una tabla loyalty_visits
  @hasMany(() => LoyaltyVisit)
  declare visits: HasMany<typeof LoyaltyVisit>
}

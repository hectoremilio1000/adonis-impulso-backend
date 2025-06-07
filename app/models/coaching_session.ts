import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Subscription from './subscription.js'

export default class CoachingSession extends BaseModel {
  public static table = 'coaching_sessions'
  @column({ isPrimary: true }) declare id: number

  @column({ columnName: 'subscription_id' })
  declare subscriptionId: number

  @column.dateTime({ columnName: 'session_date' })
  declare sessionDate: DateTime

  @column() declare type: 'presencial' | 'virtual'

  @column() declare hours: number

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  @belongsTo(() => Subscription, {
    foreignKey: 'subscription_id',
  })
  declare subscription: BelongsTo<typeof Subscription>
}

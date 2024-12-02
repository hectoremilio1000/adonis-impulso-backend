import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Subscription from './subscription.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ isPrimary: true })
  declare subscription_id: number

  @column({ isPrimary: true })
  declare method_payment: string

  @column({ isPrimary: true })
  declare status: string

  @column({ isPrimary: true })
  declare transaction_number: number

  @column({ isPrimary: true })
  declare amount: number

  @column({ isPrimary: true })
  declare payment_date: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación para obtener los detalles del p ago
  @belongsTo(() => Subscription, {
    foreignKey: 'subscription_id',
  })
  declare subscription: BelongsTo<typeof Subscription>
}

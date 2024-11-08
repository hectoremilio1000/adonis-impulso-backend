import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Plan from './plan.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare plan_id: number

  @column()
  declare start_date: string

  @column()
  declare end_date: string

  @column()
  declare status: string

  @column()
  declare created_by: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación para obtener los detalles del plan
  @belongsTo(() => Plan, {
    foreignKey: 'plan_id',
  })
  declare plan: BelongsTo<typeof Plan>
}

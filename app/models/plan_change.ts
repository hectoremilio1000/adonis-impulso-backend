// app/Models/PlanChange.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Subscription from './subscription.js'
import Plan from './plan.js'
import User from './user.js'

export default class PlanChange extends BaseModel {
  public static table = 'plan_changes'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare subscriptionId: number

  @column()
  declare oldPlanId: number | null

  @column()
  declare newPlanId: number

  @column.dateTime()
  declare changedAt: DateTime

  @column()
  declare userId: number | null

  @belongsTo(() => Subscription)
  declare subscription: BelongsTo<typeof Subscription>

  @belongsTo(() => Plan, { foreignKey: 'oldPlanId' })
  declare oldPlan: BelongsTo<typeof Plan>

  @belongsTo(() => Plan, { foreignKey: 'newPlanId' })
  declare newPlan: BelongsTo<typeof Plan>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

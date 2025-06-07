import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Plan from './plan.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Module from './module.js'
import User from './user.js'

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
  declare end_date: string | null

  @column.dateTime({ columnName: 'trial_ends_at' }) declare trialEndsAt: DateTime | null

  @column()
  declare status: string

  @column()
  public coachingIncluded!: number

  @column()
  public coachingUsed!: number

  @column()
  declare created_by: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  // Relación con Plan (si la manejas así)
  @belongsTo(() => Plan, {
    foreignKey: 'plan_id',
  })
  declare plan: BelongsTo<typeof Plan>

  @manyToMany(() => Module, {
    pivotTable: 'subscription_modules',
    localKey: 'id',
    pivotForeignKey: 'subscription_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'module_id',
  })
  declare modules: ManyToMany<typeof Module>
}

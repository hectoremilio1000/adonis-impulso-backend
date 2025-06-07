import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Module from './module.js'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare coachingIncluded: number

  @column()
  declare active: boolean

  @column()
  declare created_by: number
  @column()
  declare max_modules: number

  @manyToMany(() => Module, {
    pivotTable: 'plans_modules', // la pivot
    localKey: 'id', // PK en "Plan"
    pivotForeignKey: 'plan_id', // FK a "plans"
    relatedKey: 'id', // PK en "Module"
    pivotRelatedForeignKey: 'module_id',
  })
  declare modules: ManyToMany<typeof Module>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

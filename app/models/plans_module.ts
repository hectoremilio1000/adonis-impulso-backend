import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PlansModule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare planId: number // clave foránea a `plans`

  @column()
  declare moduleId: number // clave foránea a `modules`

  @column()
  declare created_by: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

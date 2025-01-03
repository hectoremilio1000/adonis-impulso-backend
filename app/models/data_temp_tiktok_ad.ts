import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DataTempTiktokAd extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare company_id: number

  @column()
  declare user_id: number

  @column()
  declare name_campaign: number

  @column()
  declare start_date: DateTime

  @column()
  declare end_date: DateTime

  @column()
  declare status_active: boolean

  @column()
  declare status_run: string

  @column()
  declare conversions: number

  @column()
  declare impressions: boolean

  @column()
  declare clicks: number

  @column()
  declare results: number

  @column()
  declare costo: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

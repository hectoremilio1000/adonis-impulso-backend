import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UsersCalendly extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare calendly_uid: string

  @column()
  declare access_token: string

  @column()
  declare refresh_token: string

  @column()
  declare user_id: number

  @column()
  declare company_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

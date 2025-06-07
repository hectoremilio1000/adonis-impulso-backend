// file: app/Models/LegalTicket.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class LegalTicket extends BaseModel {
  // Indica explícitamente la tabla
  public static table = 'legal_tickets'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare subject: string | 'pending'

  @column()
  declare description: string

  @column()
  declare status: string

  // Para JSON
  @column()
  declare attachments: string[] | null // o string, si prefieres

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>
}

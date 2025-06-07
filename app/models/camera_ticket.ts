import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'

export default class CameraTicket extends BaseModel {
  public static table = 'camera_tickets'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare subject: string

  @column()
  declare description: string

  @column()
  declare cameraName: string | null

  @column.dateTime({ autoCreate: false })
  declare startTime: DateTime | null

  @column.dateTime({ autoCreate: false })
  declare endTime: DateTime | null

  @column()
  declare status: string // new, in_progress, resolved, cancelled...

  @column()
  declare resolution: string | null

  @column()
  declare companyId: number | null

  @column({
    // Para indicar que "attachments" es JSON en la base de datos
    // o si usas MySQL con tipo JSON
  })
  declare attachments: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación con el usuario
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>
}

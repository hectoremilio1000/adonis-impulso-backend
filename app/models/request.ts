// file: app/Models/Request.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'

// Importar el User model, si se guarda en app/Models/User.ts
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Request extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare status: 'pending' | 'in_progress' | 'completed' | 'rejected'

  @column()
  declare attachments: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación con User
  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>
}

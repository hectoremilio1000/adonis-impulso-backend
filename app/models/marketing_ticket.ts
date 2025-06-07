// file: app/Models/MarketingTicket.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

// Importamos el modelo User si está en app/Models/User.ts

export default class MarketingTicket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare campaign_type: string // "Google", "TikTok", "Meta", etc.

  @column()
  declare objective: string // Descripción de lo que se quiere lograr

  @column()
  declare budget: number // Presupuesto de la campaña

  @column()
  declare status: 'new' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'

  // Usamos json -> un array de strings para guardar nombres de archivos subidos
  @column({
    // Para indicar que "attachments" es JSON en la base de datos
    // o si usas MySQL con tipo JSON
  })
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

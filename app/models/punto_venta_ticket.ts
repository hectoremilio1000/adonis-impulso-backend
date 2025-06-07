// file: app/Models/PuntoVentaTicket.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class PuntoVentaTicket extends BaseModel {
  public static table = 'punto_venta'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number | null

  @column()
  declare titulo_problema: string

  @column()
  declare descripcion_problema: string

  @column()
  declare urgencia: 'baja' | 'media' | 'alta'

  @column()
  declare whatsapp: string | null

  @column()
  declare foto: string | null // Ruta al archivo. Ej: "storage/uploads/punto_venta/abc123.png"

  @column()
  declare status: 'new' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación con User si lo requieres
  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>
}

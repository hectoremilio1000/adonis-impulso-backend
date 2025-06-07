// app/Models/Inventory.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Inventory extends BaseModel {
  public static table = 'inventarios'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare tipoInventario: string // "un_producto", "varios", "todos"

  @column()
  declare priority: string // "baja", "normal", "alta"

  @column()
  declare status: string // "pending", "in_progress", "completed", etc.

  @column()
  declare attachments: string | null // JSON string con rutas de archivo

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación con user
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>
}

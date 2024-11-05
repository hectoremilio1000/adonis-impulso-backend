import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sede from './sede.js'

export default class UserSede extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare user_id: number
  @column()
  declare sede_id: number
  @column()
  declare created_by: number

  // Relación autorreferencial para obtener el usuario
  @belongsTo(() => User, {
    foreignKey: 'user_id', // Llave foránea en la tabla users que apunta a roles
  })
  declare usuario: BelongsTo<typeof User>

  // Relación autorreferencial para obtener la sede
  @belongsTo(() => Sede, {
    foreignKey: 'sede_id', // Llave foránea en la tabla user_Sede que apunta a sedes
  })
  declare sede: BelongsTo<typeof Sede>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

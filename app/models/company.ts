import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Sede from './sede.js'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare logo: string

  @column()
  declare website: string

  @column()
  declare phone_contact: string

  @column()
  declare user_id: number

  @column()
  declare created_by: number

  // Relación autorreferencial para obtener el rol
  @belongsTo(() => User, {
    foreignKey: 'user_id', // Llave foránea en la tabla users que apunta a roles
  })
  declare admin: BelongsTo<typeof User>

  @hasMany(() => Sede, {
    foreignKey: 'id',
  })
  declare sedes: HasMany<typeof Sede>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

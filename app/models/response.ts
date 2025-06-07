import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Option from './option.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Prospect from './prospect.js'
import User from './user.js'

export default class Response extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare prospect_id: number | null

  @column()
  declare user_id: number | null // si lo usas

  @column()
  declare option_id: number

  @belongsTo(() => Option, { foreignKey: 'option_id' })
  declare option: BelongsTo<typeof Option>
  // NÓTESE: cambié de "options" a "option" (singular)

  // OPCIONAL: si deseas la relación belongsTo con Prospect
  @belongsTo(() => Prospect, { foreignKey: 'prospect_id' })
  declare prospect: BelongsTo<typeof Prospect>

  // OPCIONAL: si tu response también puede apuntar a un user
  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

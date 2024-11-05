import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import Role from './role.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
// import { BelongsTo } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare email_verified_at: DateTime | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare rol_id: number

  @column()
  declare created_by: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación autorreferencial para obtener el rol
  @belongsTo(() => Role, {
    foreignKey: 'rol_id', // Llave foránea en la tabla users que apunta a roles
  })
  declare rol: BelongsTo<typeof Role>
  // Relación autorreferencial para obtener el creador
  @belongsTo(() => User, {
    foreignKey: 'created_by', // Llave foránea en la tabla users que apunta a roles
  })
  declare creator: BelongsTo<typeof User>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}

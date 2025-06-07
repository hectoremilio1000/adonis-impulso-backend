import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

// Modelos relacionados
import Company from './company.js'
import Role from './role.js'
import Subscription from './subscription.js'

// Tipos de relaciones, si usas TypeScript
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'

// Creamos la configuración de AuthFinder
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'], // Usamos 'email' como identificador único
  passwordColumnName: 'password', // La columna donde está la contraseña hasheada
})

export default class User extends compose(BaseModel, AuthFinder) {
  // Identificador primario
  @column({ isPrimary: true })
  declare id: number

  // Nombre (puede ser null si no siempre se rellena)
  @column()
  declare name: string | null

  @column()
  declare isActive: boolean

  // Email (el “username” para login)
  @column()
  declare email: string

  // Fecha en que se verificó el email (opcional)
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare email_verified_at: DateTime | null

  // Contraseña (oculta en respuestas JSON)
  @column({ serializeAs: null })
  declare password: string

  // ID del rol que tenga (foránea a la tabla roles)
  @column()
  declare rol_id: number

  // ID del usuario que lo creó (opcional)
  @column()
  declare created_by: number

  @belongsTo(() => User, {
    foreignKey: 'created_by',
  })
  declare creator: BelongsTo<typeof User>

  // Token para resetear contraseña (opcional)
  @column()
  declare password_reset_token: string | null

  // WhatsApp (opcional)
  @column()
  declare whatsapp: string | null

  // Fecha de creación
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Fecha de actualización
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relación: belongsTo => cada user pertenece a un Rol
  @belongsTo(() => Role, {
    foreignKey: 'rol_id', // La columna en 'users' que apunta a la PK de 'roles'
  })
  declare rol: BelongsTo<typeof Role>

  // Relación: un user tiene UNA suscripción actual
  @hasOne(() => Subscription, {
    foreignKey: 'user_id',
  })
  declare subscription: HasOne<typeof Subscription>

  // Relación: un user puede tener muchas suscripciones (historial)
  @hasMany(() => Subscription, {
    foreignKey: 'user_id',
  })
  declare subscriptions: HasMany<typeof Subscription>

  // Configuración de tokens (tabla "auth_access_tokens")
  public static accessTokens = DbAccessTokensProvider.forModel(User, {
    table: 'auth_access_tokens',
    prefix: 'oat_',
    expiresIn: '30 days',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  // Relación: un user puede tener muchas empresas (si en la tabla companies hay 'user_id')
  @hasMany(() => Company, {
    foreignKey: 'user_id', // la columna en 'companies' que apunta a 'users.id'
  })
  declare companies: HasMany<typeof Company>

  @hasMany(() => Employee, {
    foreignKey: 'userId', // la columna en employees que apunta a users.id
  })
  declare employees: HasMany<typeof Employee>
}

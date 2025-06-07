import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Sede from './sede.js'
import Employee from './employee.js'
import Candidate from './candidate.js'

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

  @column({ columnName: 'user_id' })
  declare user_id: number

  @column()
  declare created_by: number

  // Relación autorreferencial para obtener el rol
  @belongsTo(() => User, {
    foreignKey: 'user_id', // Llave foránea en la tabla users que apunta a roles
  })
  declare admin: BelongsTo<typeof User>

  @hasMany(() => Sede, {
    foreignKey: 'company_id',
  })
  declare sedes: HasMany<typeof Sede>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Employee, {
    foreignKey: 'company_id',
  })
  declare employees: HasMany<typeof Employee>

  @hasMany(() => Candidate, {
    foreignKey: 'companyId', // la fk en el modelo Candidate
  })
  declare candidates: HasMany<typeof Candidate>
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import Candidate from './candidate.js'
import User from './user.js'
import Position from './position.js'

export default class Employee extends BaseModel {
  public static table = 'employees'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'company_id' })
  declare company_id: number

  @column()
  declare name: string

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column({ columnName: 'position_id' })
  declare positionId: number | null

  @column({ columnName: 'user_id' })
  declare userId: number | null

  // Relación: belongsTo con el User (el que lo representa, rol=4)
  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  @column({ columnName: 'candidate_id' })
  declare candidateId: number | null

  @column({ columnName: 'created_by' })
  declare createdBy: number | null

  @belongsTo(() => User, {
    foreignKey: 'created_by',
  })
  declare creator: BelongsTo<typeof User> // "creator" es el admin que lo creó

  @belongsTo(() => Candidate, {
    foreignKey: 'candidate_id',
  })
  declare candidate: BelongsTo<typeof Candidate>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación con la Company
  @belongsTo(() => Company, {
    foreignKey: 'company_id',
  })
  declare company: BelongsTo<typeof Company>

  @belongsTo(() => Position, {
    foreignKey: 'positionId',
  })
  declare position: BelongsTo<typeof Position>
}

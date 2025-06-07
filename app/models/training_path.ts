// app/Models/TrainingPath.ts

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import TrainingModule from './training_module.js'

export default class TrainingPath extends BaseModel {
  public static table = 'training_paths'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  // Si usas un string para rol, "mesero", "cocinero", etc.
  @column()
  declare role_name: string | null

  @column({ columnName: 'company_id' })
  declare companyId: number | null

  @belongsTo(() => Company, {
    foreignKey: 'company_id',
  })
  declare company: BelongsTo<typeof Company>

  @hasMany(() => TrainingModule, {
    foreignKey: 'trainingPathId', // Asumiendo que iremos por 1:N
  })
  declare modules: HasMany<typeof TrainingModule>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

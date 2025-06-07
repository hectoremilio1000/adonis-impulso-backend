// app/Models/TrainingManual.ts

import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Position from './position.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'

export default class TrainingManual extends BaseModel {
  public static table = 'training_manuals'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  // Aquí la foreign key:
  @column()
  declare companyId: number

  // Y la relación:
  @belongsTo(() => Company, {
    foreignKey: 'companyId', // por defecto ya se asume companyId
  })
  declare company: BelongsTo<typeof Company>

  // Si existe la tabla positions, haz lo mismo
  @column()
  declare positionId: number

  @belongsTo(() => Position, {
    foreignKey: 'positionId',
  })
  declare position: BelongsTo<typeof Position>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

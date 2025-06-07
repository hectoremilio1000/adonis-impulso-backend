// app/Models/Position.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import type { HasMany } from '@adonisjs/lucid/types/relations'
import TrainingManual from './training_manual.js'
import Employee from './employee.js'

export default class Position extends BaseModel {
  public static table = 'positions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare tipo: string

  @column()
  declare version: number

  @column()
  declare activo: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => TrainingManual, {
    foreignKey: 'positionId', // O 'position_id' si lo manejas así en tu modelo
  })
  declare manuals: HasMany<typeof TrainingManual>
  @hasMany(() => Employee, {
    foreignKey: 'positionId',
  })
  declare employees: HasMany<typeof Employee>
}

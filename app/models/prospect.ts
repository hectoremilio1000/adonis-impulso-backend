import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Option from './option.js'
import Recommendation from './recommendation.js'
import { default as ResponseModel } from './response.js'

export default class Prospect extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare first_name: string

  @column()
  declare last_name: string

  @column()
  declare email: string

  @column()
  declare whatsapp: string

  @manyToMany(() => Option, {
    pivotTable: 'responses', // Especifica el nombre de la tabla pivote
    pivotForeignKey: 'prospect_id', // Columna en la tabla pivote que hace referencia a `Plan`
    pivotRelatedForeignKey: 'option_id', // Columna en la tabla pivote que hace referencia a `Module`
  })
  declare options: ManyToMany<typeof Option>

  @hasMany(() => ResponseModel, {
    foreignKey: 'prospect_id',
  })
  declare responses: HasMany<typeof ResponseModel>

  /**
   * Relación hasMany con "Recommendation" (tabla con prospect_id).
   * Esto te permite usar .preload('recommendations') o .whereHas('recommendations').
   */
  @hasMany(() => Recommendation, {
    foreignKey: 'prospect_id',
  })
  declare recommendations: HasMany<typeof Recommendation>

  @column()
  declare status: string

  @column()
  declare origin: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

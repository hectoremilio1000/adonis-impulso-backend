import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Option from './option.js'

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

  @column()
  declare status: string

  @column()
  declare origin: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

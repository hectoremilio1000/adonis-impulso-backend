import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Module from './module.js'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare active: boolean

  @column()
  declare created_by: number

  @manyToMany(() => Module, {
    pivotTable: 'plans_modules', // Especifica el nombre de la tabla pivote
    pivotForeignKey: 'plan_id', // Columna en la tabla pivote que hace referencia a `Plan`
    pivotRelatedForeignKey: 'module_id', // Columna en la tabla pivote que hace referencia a `Module`
  })
  declare modules: ManyToMany<typeof Module>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

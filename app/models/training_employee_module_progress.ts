// app/Models/EmployeeModuleProgress.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EmployeeModuleProgress extends BaseModel {
  public static table = 'training_employee_module_progress'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare employeeId: number

  @column()
  declare moduleId: number

  @column()
  declare status: 'not_started' | 'in_progress' | 'completed'

  @column()
  declare score: number | null

  @column()
  declare passed: boolean

  @column.dateTime()
  declare completedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

// app/Models/EmployeeTrainingPath.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Employee from './employee.js'
import TrainingPath from './training_path.js'

export default class EmployeeTrainingPath extends BaseModel {
  public static table = 'training_employee_paths'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'employee_id' })
  declare employeeId: number

  @column({ columnName: 'training_path_id' })
  declare trainingPathId: number

  @column()
  declare status: 'not_started' | 'in_progress' | 'completed'

  @belongsTo(() => Employee)
  declare employee: BelongsTo<typeof Employee>

  @belongsTo(() => TrainingPath)
  declare trainingPath: BelongsTo<typeof TrainingPath>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

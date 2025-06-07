// app/Models/EmployeeLessonProgress.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EmployeeLessonProgress extends BaseModel {
  public static table = 'training_employee_lesson_progress'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'employee_id' })
  declare employeeId: number

  @column({ columnName: 'lesson_id' })
  declare lessonId: number

  @column.dateTime()
  declare viewedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameEmployeeLessonTrainingEmployee extends BaseSchema {
  public async up() {
    this.schema.renameTable('employee_lesson_progress', 'training_employee_lesson_progress')
  }

  public async down() {
    // revertir el cambio
    this.schema.renameTable('training_employee_lesson_progress', 'employee_lesson_progress')
  }
}

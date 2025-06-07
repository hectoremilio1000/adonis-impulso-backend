import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameLessonsTableTrainingEmployee extends BaseSchema {
  public async up() {
    this.schema.renameTable('employee_module_progress', 'training_employee_module_progress')
  }

  public async down() {
    // revertir el cambio
    this.schema.renameTable('training_employee_module_progress', 'employee_module_progress')
  }
}

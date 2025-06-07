import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameQuizzesToTrainingQuizzes extends BaseSchema {
  public async up() {
    this.schema.renameTable('quizzes', 'training_quizzes')
  }

  public async down() {
    // revertir el cambio
    this.schema.renameTable('training_quizzes', 'quizzes')
  }
}

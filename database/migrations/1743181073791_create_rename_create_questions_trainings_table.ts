import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenamequestionsTrainingToTrainingQuestions extends BaseSchema {
  public async up() {
    this.schema.renameTable('create_questions_training', 'training_questions')
  }

  public async down() {
    // revertir el cambio
    this.schema.renameTable('training_questions', 'create_questions_training')
  }
}

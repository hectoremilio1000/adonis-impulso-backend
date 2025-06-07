import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameLessonsToTrainingLessons extends BaseSchema {
  public async up() {
    this.schema.renameTable('lessons', 'training_lessons')
  }

  public async down() {
    // revertir el cambio
    this.schema.renameTable('training_lessons', 'lessons')
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('whatsapp', 20).notNullable()
      table.string('email', 255).notNullable()
      table.string('cv_path', 255).nullable()
      table.integer('company_id').unsigned().references('id').inTable('companies')

      // Reference 1
      table.string('reference1_company', 255).nullable()
      table.string('reference1_position', 255).nullable()
      table.string('reference1_name', 255).nullable()
      table.string('reference1_timeworked', 50).nullable()
      table.string('reference1_whatsapp', 20).nullable()

      // Reference 2
      table.string('reference2_company', 255).nullable()
      table.string('reference2_position', 255).nullable()
      table.string('reference2_name', 255).nullable()
      table.string('reference2_timeworked', 50).nullable()
      table.string('reference2_whatsapp', 20).nullable()

      table.string('position', 255).notNullable()
      table.text('comments').nullable()

      table
        .enum('status', ['To Review', 'Start Exam', 'Exam Completed', 'Approved', 'Discarded'])
        .defaultTo('To Review')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTrainingManuals extends BaseSchema {
  protected tableName = 'training_manuals'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('content').nullable()

      // Referencia a 'positions' si quieres
      table.integer('position_id').unsigned().nullable().index()

      // Referencia a 'companies'
      table.integer('company_id').unsigned().nullable().index()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

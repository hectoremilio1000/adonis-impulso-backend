import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Surveys extends BaseSchema {
  protected tableName = 'surveys'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      // user_id => dueño de la encuesta final
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.string('title').notNullable()
      // code => identificador único para generar el QR o link
      table.string('code').notNullable().unique()

      // Si está activa o no
      table.boolean('is_active').defaultTo(true)

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

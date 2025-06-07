import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddMaxModulesToPlans extends BaseSchema {
  protected tableName = 'plans'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('max_modules').notNullable().defaultTo(0)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('max_modules')
    })
  }
}

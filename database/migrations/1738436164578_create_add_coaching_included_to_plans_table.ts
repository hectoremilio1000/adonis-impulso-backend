import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCoachingIncludedToPlans extends BaseSchema {
  protected tableName = 'plans'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Aquí agregas tu columna
      table.integer('coaching_included').notNullable().defaultTo(0).after('max_modules')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Remover la columna en caso de rollback
      table.dropColumn('coaching_included')
    })
  }
}

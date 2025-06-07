import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUserIdToLoyaltyPrograms extends BaseSchema {
  protected tableName = 'loyalty_programs'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .after('id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // 1. Eliminar la foreign key
      table.dropForeign(['user_id'], 'loyalty_programs_user_id_foreign')
      // 2. Eliminar la columna
      table.dropColumn('user_id')
    })
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUserIdAndCustomerNameToLoyaltyCards extends BaseSchema {
  protected tableName = 'loyalty_cards'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // (Opcional) user_id si quieres vincular la tarjeta a un "User" de tu sistema
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .after('program_id')

      // (Recomendado) customer_name para registrar el nombre del cliente final
      table.string('customer_name').nullable().after('user_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Eliminar la foreign key
      table.dropForeign(['user_id'], 'loyalty_cards_user_id_foreign')
      // Eliminar columnas
      table.dropColumn('user_id')
      table.dropColumn('customer_name')
    })
  }
}

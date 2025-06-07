import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    // ALTER TABLE "users"
    this.schema.alterTable(this.tableName, (table) => {
      // crea la columna "password_reset_token"
      table.string('password_reset_token').nullable()

      // (Opcional) si quisieras una fecha de expiración:
      // table.dateTime('password_reset_expires_at').nullable()
    })
  }

  public async down() {
    // Revertimos el cambio si hacemos "migration:rollback"
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('password_reset_token')
      // table.dropColumn('password_reset_expires_at')
    })
  }
}

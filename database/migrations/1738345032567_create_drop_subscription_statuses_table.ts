import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DropSubscriptionStatus extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // 1) Solo elimina la columna 'status'
      table.dropColumn('status')
    })
  }

  public async down() {
    // 2) Si haces rollback de ESTA migración, vuelves a crearla con la definición anterior
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['active', 'expired', 'cancelled']).notNullable()
    })
  }
}

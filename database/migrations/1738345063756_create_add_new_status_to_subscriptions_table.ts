import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddNewStatusToSubscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Crea la columna 'status' con la nueva enum
      table
        .enum('status', ['trialing', 'pending', 'active', 'suspended', 'expired', 'cancelled'])
        .notNullable()
        .defaultTo('trialing')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Si se hace rollback de ESTA migración, se quita la columna
      table.dropColumn('status')
    })
  }
}

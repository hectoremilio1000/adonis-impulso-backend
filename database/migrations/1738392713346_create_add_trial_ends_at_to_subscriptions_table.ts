import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddTrialEndsAtToSubscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Agregamos la columna trial_ends_at
      table.dateTime('trial_ends_at').nullable().after('status')

      // Si quieres llevar un campo de "grace_ends_at", hazlo igual:
      // table.dateTime('grace_ends_at').nullable().after('trial_ends_at')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('trial_ends_at')
      // table.dropColumn('grace_ends_at')
    })
  }
}

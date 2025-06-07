import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCoachingToSubscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Horas incluidas en el plan (2 para Básico, 4 para Pro)
      table.integer('coaching_included').defaultTo(0).after('trial_ends_at')
      // Horas ya utilizadas en el ciclo (si no usas logs de sesiones)
      table.integer('coaching_used').defaultTo(0).after('coaching_included')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('coaching_included')
      table.dropColumn('coaching_used')
    })
  }
}

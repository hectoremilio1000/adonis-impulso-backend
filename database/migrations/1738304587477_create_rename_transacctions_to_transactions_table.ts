import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameTransacctionsToTransactions extends BaseSchema {
  public async up() {
    this.schema.renameTable('transacctions', 'transactions')
  }

  public async down() {
    // En caso de rollback
    this.schema.renameTable('transactions', 'transacctions')
  }
}

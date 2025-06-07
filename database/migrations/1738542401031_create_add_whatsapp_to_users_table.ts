import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddWhatsappToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('whatsapp').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('whatsapp')
    })
  }
}

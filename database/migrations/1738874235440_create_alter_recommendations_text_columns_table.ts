import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AlterRecommendationsTextColumn extends BaseSchema {
  protected tableName = 'recommendations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('text', 'longtext').alter()
    })
  }

  public async down() {
    // En caso de querer revertir a su tipo original,
    // sustituye 'longtext' por lo que fuera antes (e.g. 'text').
    this.schema.alterTable(this.tableName, (table) => {
      table.text('text', 'text').alter()
    })
  }
}

// database/migrations/XXX_add_candidate_id_to_employees.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCandidateIdToEmployees extends BaseSchema {
  protected tableName = 'employees'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('candidate_id')
        .unsigned()
        .nullable()
        .references('candidates.id')
        .onDelete('CASCADE')
        .after('company_id') // para que quede después de company_id
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('candidate_id')
    })
  }
}

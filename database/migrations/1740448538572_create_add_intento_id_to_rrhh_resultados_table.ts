import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddIntentoIdToRrhhResultados extends BaseSchema {
  protected tableName = 'rrhh_resultados'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Añade la columna intento_id
      // Según tu uso, podría ser string, por si lo generas como "intento-1234".
      table.string('intento_id').nullable().after('candidato_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('intento_id')
    })
  }
}

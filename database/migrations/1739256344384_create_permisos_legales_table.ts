// file: database/migrations/XXXX_permisos_legales.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class PermisosLegales extends BaseSchema {
  protected tableName = 'permisos_legales'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable() // Ej: “Licencia de Funcionamiento”
      table.text('description').nullable() // Descripción / info detallada
      table.string('institucion').nullable() // Dónde se tramita (ej: SEDUVI, COFEPRIS, etc.)
      table.string('tramite_link').nullable() // link oficial del trámite
      // Si deseas algún costo estimado:
      table.string('costo').nullable()
      // timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

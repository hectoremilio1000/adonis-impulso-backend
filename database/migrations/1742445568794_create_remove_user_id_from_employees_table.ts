import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RemoveUserIdFromEmployees extends BaseSchema {
  protected tableName = 'employees'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // 1) Elimina la foreign key 'employees_user_id_foreign' u otro nombre que MySQL haya asignado
      //    (por defecto Adonis pone `<tabla>_<columna>_foreign`)
      table.dropForeign('user_id')

      // 2) Ahora sí, elimina la columna user_id
      table.dropColumn('user_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Para revertir, recreamos la columna y su FK
      table.integer('user_id').unsigned().nullable()

      table.foreign('user_id').references('users.id').onDelete('SET NULL')
    })
  }
}

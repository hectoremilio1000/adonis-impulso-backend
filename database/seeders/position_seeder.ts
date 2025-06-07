// database/seeders/PositionSeeder.ts
import Position from '#models/position'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class PositionSeeder extends BaseSeeder {
  public async run() {
    await Position.createMany([
      { nombre: 'Mesero', tipo: 'piso', version: 1, activo: true },
      { nombre: 'Gerente', tipo: 'piso', version: 1, activo: true },
      { nombre: 'Subgerente', tipo: 'piso', version: 1, activo: true },
      { nombre: 'Barman', tipo: 'barra', version: 1, activo: true },
      { nombre: 'Backbar', tipo: 'barra', version: 1, activo: true },
      { nombre: 'Jefe de Barra', tipo: 'barra', version: 1, activo: true },
      { nombre: 'Cocinero', tipo: 'cocina', version: 1, activo: true },
      { nombre: 'Lavaloza', tipo: 'cocina', version: 1, activo: true },
      { nombre: 'Ayudante de Cocina', tipo: 'cocina', version: 1, activo: true },
      { nombre: 'Subjefe de Cocina', tipo: 'cocina', version: 1, activo: true },
      { nombre: 'Jefe de Cocina', tipo: 'cocina', version: 1, activo: true },
      { nombre: 'Capitán', tipo: 'piso', version: 1, activo: true },
      { nombre: 'Garrotero', tipo: 'piso', version: 1, activo: true },
    ])
  }
}

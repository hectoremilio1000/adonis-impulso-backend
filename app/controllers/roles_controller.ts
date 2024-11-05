import type { HttpContext } from '@adonisjs/core/http'

import Role from '#models/role'

export default class RolesController {
  // Listar todos los planes (GET /plans)
  public async index({}: HttpContext) {
    const roles = await Role.all()
    return roles
  }

  // Mostrar un plan individual por ID (GET /plans/:id)
  public async show({ params }: HttpContext) {
    console.log(params)
    const rol = await Role.findOrFail(params.id)
    console.log(rol)
    return rol
  }

  // Crear un nuevo rol (POST /plans)
  public async store({ request }: HttpContext) {
    const data = request.only(['name', 'created_by']) // Asume que estos campos existen
    const rol = await Role.create(data)
    return rol
  }

  // Actualizar un plan existente (PUT /plans/:id)
  public async update({ params, request }: HttpContext) {
    const rol = await Role.findOrFail(params.id)
    const data = request.only(['name', 'created_by'])
    rol.merge(data)
    await rol.save()
    return rol
  }

  // Eliminar un rol (DELETE /plans/:id)
  public async destroy({ params }: HttpContext) {
    const rol = await Role.findOrFail(params.id)
    await rol.delete()
    return { message: 'Rol deleted successfully' }
  }
}

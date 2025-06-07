// file: app/Controllers/Http/RolesController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'

export default class RolesController {
  /**
   * Listar todos los roles (GET /roles)
   */
  public async index({ response }: HttpContext) {
    try {
      const roles = await Role.all()
      return response.status(200).json({
        status: 'success',
        message: 'Roles fetched successfully',
        data: roles,
      })
    } catch (error) {
      console.error('Error en RolesController.index:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al obtener los roles',
        error: error.message,
      })
    }
  }

  /**
   * Mostrar un rol por ID (GET /roles/:id)
   */
  public async show({ params, response }: HttpContext) {
    try {
      const rol = await Role.findOrFail(params.id)

      return response.status(200).json({
        status: 'success',
        message: `Rol ${params.id} obtenido correctamente`,
        data: rol,
      })
    } catch (error) {
      console.error('Error en RolesController.show:', error)
      return response.status(404).json({
        status: 'error',
        message: 'Rol no encontrado',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo rol (POST /roles)
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name']) // Si tienes más campos, inclúyelos
      const rol = await Role.create(data)

      return response.status(201).json({
        status: 'success',
        message: 'Rol creado correctamente',
        data: rol,
      })
    } catch (error) {
      console.error('Error en RolesController.store:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al crear el rol',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un rol existente (PUT /roles/:id)
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const rol = await Role.findOrFail(params.id)
      const data = request.only(['name'])
      rol.merge(data)
      await rol.save()

      return response.status(200).json({
        status: 'success',
        message: `Rol ${params.id} actualizado correctamente`,
        data: rol,
      })
    } catch (error) {
      console.error('Error en RolesController.update:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al actualizar el rol',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un rol (DELETE /roles/:id)
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const rol = await Role.findOrFail(params.id)
      await rol.delete()

      return response.status(200).json({
        status: 'success',
        message: `Rol ${params.id} eliminado correctamente`,
      })
    } catch (error) {
      console.error('Error en RolesController.destroy:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al eliminar el rol',
        error: error.message,
      })
    }
  }
}

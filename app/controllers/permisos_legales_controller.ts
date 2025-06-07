// file: app/Controllers/Http/PermisosLegalesController.ts
import PermisoLegal from '#models/permisos_legale'
import type { HttpContext } from '@adonisjs/core/http'

export default class PermisosLegalesController {
  /**
   * INDEX: Lista todos los permisos legales
   */
  public async index({ response }: HttpContext) {
    try {
      const permisos = await PermisoLegal.query().orderBy('id', 'asc')
      return response.ok({
        status: 'success',
        data: permisos,
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * SHOW: Muestra un permiso individual
   */
  public async show({ params, response }: HttpContext) {
    try {
      const permiso = await PermisoLegal.findOrFail(params.id)
      return response.ok({
        status: 'success',
        data: permiso,
      })
    } catch (error) {
      return response.notFound({
        status: 'error',
        message: 'Permiso no encontrado',
      })
    }
  }

  /**
   * STORE: Crea un nuevo permiso legal
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description', 'institucion', 'tramite_link', 'costo'])

      if (!data.name) {
        return response.badRequest({ message: 'El campo name es obligatorio' })
      }

      const nuevoPermiso = await PermisoLegal.create(data)

      return response.created({
        status: 'success',
        message: 'Permiso creado correctamente',
        data: nuevoPermiso,
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * UPDATE: Actualiza un permiso
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const permiso = await PermisoLegal.findOrFail(params.id)

      const data = request.only(['name', 'description', 'institucion', 'tramite_link', 'costo'])
      permiso.merge(data)
      await permiso.save()

      return response.ok({
        status: 'success',
        message: 'Permiso actualizado',
        data: permiso,
      })
    } catch (error) {
      return response.notFound({
        status: 'error',
        message: 'No se pudo actualizar el permiso',
      })
    }
  }

  /**
   * DESTROY: Elimina un permiso
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const permiso = await PermisoLegal.findOrFail(params.id)
      await permiso.delete()
      return response.ok({
        status: 'success',
        message: 'Permiso eliminado',
      })
    } catch (error) {
      return response.notFound({
        status: 'error',
        message: 'No se pudo eliminar el permiso',
      })
    }
  }
}

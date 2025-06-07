// app/Controllers/Http/TrainingPathsController.ts

import type { HttpContext } from '@adonisjs/core/http'
import TrainingPath from '#models/training_path'

export default class TrainingPathsController {
  /**
   * GET /api/training-paths
   *
   * Lista todas las rutas de capacitación.
   * - Opcionalmente podrías filtrar por ?role_name=mesero, etc.
   */
  public async index({ request, response }: HttpContext) {
    try {
      // Si deseas filtrar por ?role_name=, por ejemplo:
      const roleName = request.qs().role_name // /api/training-paths?role_name=mesero

      const query = TrainingPath.query().preload('modules')

      if (roleName) {
        query.where('role_name', roleName)
      }

      const paths = await query
      return response.json({
        status: 'success',
        data: paths,
      })
    } catch (error) {
      console.error('[TrainingPathsController.index]', error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo listar las rutas de capacitación',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/training-paths/:id
   *
   * Muestra una ruta individual con preload de módulos (y sus lecciones si deseas).
   */
  public async show({ params, response }: HttpContext) {
    try {
      const pathId = params.id
      const path = await TrainingPath.query()
        .where('id', pathId)
        .preload('modules', () => {
          // modulesQuery.preload('lessons') // si tienes la relación lecciones
        })
        .firstOrFail()

      return response.json({
        status: 'success',
        data: path,
      })
    } catch (error) {
      console.error('[TrainingPathsController.show]', error)
      return response.status(404).json({
        status: 'error',
        message: 'Ruta de capacitación no encontrada',
      })
    }
  }

  /**
   * POST /api/training-paths
   * Crea una nueva ruta de capacitación.
   * Espera en el body: { title, description, role_name, companyId (opcional) }
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'description', 'role_name', 'companyId'])
      const path = await TrainingPath.create({
        title: data.title,
        description: data.description,
        role_name: data.role_name || null,
        companyId: data.companyId || null,
      })

      return response.json({
        status: 'success',
        message: 'Ruta de capacitación creada correctamente',
        data: path,
      })
    } catch (error) {
      console.error('[TrainingPathsController.store]', error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo crear la ruta de capacitación',
        error: error.message,
      })
    }
  }

  /**
   * PUT /api/training-paths/:id
   * Actualiza una ruta de capacitación.
   * Espera en el body: { title, description, role_name, companyId? }
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const pathId = params.id
      const data = request.only(['title', 'description', 'role_name', 'companyId'])

      const path = await TrainingPath.findOrFail(pathId)

      path.merge({
        title: data.title ?? path.title,
        description: data.description ?? path.description,
        role_name: data.role_name ?? path.role_name,
        companyId: data.companyId ?? path.companyId,
      })

      await path.save()

      return response.json({
        status: 'success',
        message: 'Ruta de capacitación actualizada con éxito',
        data: path,
      })
    } catch (error) {
      console.error('[TrainingPathsController.update]', error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo actualizar la ruta de capacitación',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /api/training-paths/:id
   * Elimina la ruta de capacitación por su ID.
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const pathId = params.id
      const path = await TrainingPath.findOrFail(pathId)
      await path.delete()

      return response.json({
        status: 'success',
        message: 'Ruta de capacitación eliminada correctamente',
      })
    } catch (error) {
      console.error('[TrainingPathsController.destroy]', error)
      return response.status(404).json({
        status: 'error',
        message: 'No se pudo eliminar la ruta de capacitación o no existe',
      })
    }
  }
}

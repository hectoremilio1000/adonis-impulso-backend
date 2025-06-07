import type { HttpContext } from '@adonisjs/core/http'
import Sede from '#models/sede' // Ajusta la ruta real de tu modelo

export default class SedesController {
  /**
   * GET /api/sedes
   * Lista todas las sedes
   */
  public async index({ response }: HttpContext) {
    try {
      // Consulta todas las sedes (o usa .query().preload(...) si tienes relaciones)
      const sedes = await Sede.all()

      return response.status(200).json({
        status: 'success',
        code: 200,
        message: 'Sedes fetched successfully',
        data: sedes,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error al obtener sedes',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/sedes/:id
   * Muestra los detalles de una sede
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const sede = await Sede.findOrFail(id) // Lanza excepción si no existe

      return response.status(200).json({
        status: 'success',
        code: 200,
        message: 'Sede fetched successfully',
        data: sede,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error al obtener la sede',
        error: error.message,
      })
    }
  }

  /**
   * POST /api/sedes
   * Crea una nueva sede
   */
  public async store({ request, response }: HttpContext) {
    try {
      // Ajusta los campos según tu modelo 'sede'
      const data = request.only(['company_id', 'name', 'location', 'map_url', 'created_by'])

      const sede = await Sede.create(data)

      return response.status(201).json({
        status: 'success',
        code: 201,
        message: 'Sede created successfully',
        data: sede,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error al crear la sede',
        error: error.message,
      })
    }
  }

  /**
   * PUT /api/sedes/:id
   * Actualiza una sede existente
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const sede = await Sede.findOrFail(id)

      // Campos a actualizar
      const data = request.only(['company_id', 'name', 'location', 'map_url', 'updated_at'])

      sede.merge(data)
      await sede.save()

      return response.status(200).json({
        status: 'success',
        code: 200,
        message: 'Sede updated successfully',
        data: sede,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error al actualizar la sede',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /api/sedes/:id
   * Elimina una sede
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const sede = await Sede.findOrFail(id)
      await sede.delete()

      return response.status(200).json({
        status: 'success',
        code: 200,
        message: 'Sede deleted successfully',
        data: null, // o { id } si quieres retornar el id eliminado
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error al eliminar la sede',
        error: error.message,
      })
    }
  }
}

// app/Controllers/Http/PositionsController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Position from '#models/position'

export default class PositionsController {
  /**
   * GET /positions
   * Retorna todas las posiciones junto a sus `manuals`.
   */
  public async index({ response }: HttpContext) {
    try {
      // preload('manuals') => para traer la lista de manuales asociados
      // Si deseas también ver employees que tengan esa Position, podrías hacer:
      // .preload('manuals').preload('employees')
      const positions = await Position.query().preload('manuals')

      return response.json({
        status: 'success',
        data: positions,
      })
    } catch (error) {
      console.error('[PositionsController.index]', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al listar positions',
        error: error.message,
      })
    }
  }

  /**
   * POST /positions
   * Crea una nueva posición. Espera { nombre, tipo, version, activo } en el body.
   */
  public async store({ request, response }: HttpContext) {
    try {
      const { nombre, tipo, version, activo } = request.only([
        'nombre',
        'tipo',
        'version',
        'activo',
      ])

      // Crea el registro en la BD
      const position = await Position.create({ nombre, tipo, version, activo })

      return response.json({
        status: 'success',
        message: 'Position creada correctamente',
        data: position,
      })
    } catch (error) {
      console.error('[PositionsController.store]', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al crear position',
        error: error.message,
      })
    }
  }

  /**
   * GET /positions/:id
   * Muestra una sola posición (busca por ID) e incluye los manuales.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const position = await Position.query()
        .where('id', params.id)
        .preload('manuals')
        // .preload('employees') si quieres ver también empleados
        .firstOrFail()

      return response.json({
        status: 'success',
        data: position,
      })
    } catch (error) {
      console.error('[PositionsController.show]', error)
      return response.status(404).json({
        status: 'error',
        message: 'Position no encontrada',
      })
    }
  }

  /**
   * PUT /positions/:id
   * Actualiza una posición existente (nombre, tipo, version, activo).
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const position = await Position.findOrFail(params.id)
      const data = request.only(['nombre', 'tipo', 'version', 'activo'])

      position.merge(data)
      await position.save()

      return response.json({
        status: 'success',
        message: 'Position actualizada correctamente',
        data: position,
      })
    } catch (error) {
      console.error('[PositionsController.update]', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al actualizar position',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /positions/:id
   * Elimina una posición por ID.
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const position = await Position.findOrFail(params.id)
      await position.delete()

      return response.json({
        status: 'success',
        message: 'Position eliminada correctamente',
      })
    } catch (error) {
      console.error('[PositionsController.destroy]', error)
      return response.status(404).json({
        status: 'error',
        message: 'Position no encontrada o no se pudo eliminar',
      })
    }
  }
}

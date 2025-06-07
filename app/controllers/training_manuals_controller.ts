// import type { HttpContext } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'
import Company from '#models/company'
import TrainingManual from '#models/training_manual'

export default class TrainingManualsController {
  public async index({ request, response }: HttpContext) {
    console.log('[TrainingManualsController.index] => INICIANDO...')

    try {
      // Para depurar, veamos los query params:
      const companyId = request.qs().companyId
      const positionId = request.qs().positionId

      console.log('[TrainingManualsController.index] => companyId:', companyId)
      console.log('[TrainingManualsController.index] => positionId:', positionId)

      // Construimos el query
      const query = TrainingManual.query().preload('company').preload('position')

      if (companyId) {
        console.log('[TrainingManualsController.index] => Filtrando por company_id:', companyId)
        query.where('company_id', companyId)
      }
      if (positionId) {
        console.log('[TrainingManualsController.index] => Filtrando por position_id:', positionId)
        query.where('position_id', positionId)
      }

      console.log('[TrainingManualsController.index] => Ejecutando el query...')
      const manuals = await query.orderBy('id', 'asc')
      console.log('[TrainingManualsController.index] => Query finalizado. Resultados:', manuals)

      return {
        status: 'success',
        data: manuals,
      }
    } catch (error) {
      console.error('[TrainingManualsController.index] => ERROR:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al listar manuales',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/training-manuals/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      // Buscamos el manual
      const manual = await TrainingManual.findOrFail(params.id)
      // Cargamos la relación, si gustas
      await manual.load((loader) => {
        loader.load('company').load('position')
      })

      return {
        status: 'success',
        data: manual,
      }
    } catch (error) {
      console.error('[TrainingManualsController.show]', error)
      return response.status(404).json({
        status: 'error',
        message: 'Manual no encontrado',
      })
    }
  }

  /**
   * POST /api/training-manuals
   */
  public async store({ request, response }: HttpContext) {
    try {
      const { title, content, companyId, positionId } = request.only([
        'title',
        'content',
        'companyId',
        'positionId',
      ])

      // Verificar si la empresa existe (si companyId != null)
      if (companyId) {
        await Company.findOrFail(companyId)
      }

      // Creamos el manual
      const manual = await TrainingManual.create({
        title,
        content,
        companyId,
        positionId,
      })

      return {
        status: 'success',
        message: 'Manual creado correctamente',
        data: manual,
      }
    } catch (error) {
      console.error('[TrainingManualsController.store]', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al crear manual',
        error: error.message,
      })
    }
  }

  /**
   * PUT /api/training-manuals/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const manual = await TrainingManual.findOrFail(params.id)

      const data = request.only(['title', 'content', 'companyId', 'positionId'])

      // Si se mandó un companyId, validamos que exista
      if (data.companyId) {
        await Company.findOrFail(data.companyId)
      }

      // Hacemos merge y guardamos
      manual.merge(data)
      await manual.save()

      return {
        status: 'success',
        message: 'Manual actualizado correctamente',
        data: manual,
      }
    } catch (error) {
      console.error('[TrainingManualsController.update]', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al actualizar manual',
        error: error.message,
      })
    }
  }

  /**
   * DELETE /api/training-manuals/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const manual = await TrainingManual.findOrFail(params.id)
      await manual.delete()

      return {
        status: 'success',
        message: 'Manual eliminado correctamente',
      }
    } catch (error) {
      console.error('[TrainingManualsController.destroy]', error)
      return response.status(404).json({
        status: 'error',
        message: 'No se pudo eliminar manual o no existe',
      })
    }
  }
}

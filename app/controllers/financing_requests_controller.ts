import type { HttpContext } from '@adonisjs/core/http'
import FinancingRequest from '#models/financing_request' // Ajusta ruta a tu conveniencia

export default class FinancingRequestsController {
  /**
   * INDEX: Listar las solicitudes
   */
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      // Si el rol 1 es superadmin:
      if (user.rol_id === 1) {
        // Superadmin => ve todas
        const requests = await FinancingRequest.query().preload('user').orderBy('id', 'desc')
        return response.ok({ status: 'success', data: requests })
      } else {
        // Usuario normal => ve sólo las suyas
        const requests = await FinancingRequest.query()
          .where('user_id', user.id)
          .preload('user')
          .orderBy('id', 'desc')
        return response.ok({ status: 'success', data: requests })
      }
    } catch (error) {
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * SHOW: Mostrar detalle de una solicitud
   */
  public async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const request = await FinancingRequest.query().where('id', params.id).preload('user').first()

      if (!request) {
        return response.notFound({ status: 'error', message: 'Solicitud no encontrada' })
      }

      // Check de permisos
      if (user.rol_id !== 1 && request.user_id !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      return response.ok({ status: 'success', data: request })
    } catch (error) {
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * STORE: Crear una nueva solicitud de financiamiento
   */
  public async store({ auth, request, response }: HttpContext) {
    try {
      // Datos desde el front
      const amount = request.input('amount')
      const reason = request.input('reason')

      // Determinar user_id (si superadmin crea a nombre de alguien más)
      let userId = auth.user!.id
      const optionalUserId = request.input('user_id')
      if (auth.user!.rol_id === 1 && optionalUserId) {
        userId = optionalUserId
      }

      if (!amount || !reason) {
        return response.badRequest({
          status: 'error',
          message: 'amount y reason son campos requeridos',
        })
      }

      const newRequest = await FinancingRequest.create({
        user_id: userId,
        amount,
        reason,
        status: 'pending', // por default
      })

      return response.created({
        status: 'success',
        message: 'Solicitud de financiamiento creada',
        data: newRequest,
      })
    } catch (error) {
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * UPDATE: Actualizar una solicitud
   */
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const financingReq = await FinancingRequest.findOrFail(params.id)

      // Checar si no es superadmin y no es dueño de la solicitud => no autorizar
      if (user.rol_id !== 1 && financingReq.user_id !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      // Campos editables
      // Ojo: un user normal tal vez sólo puede actualizar "reason" o "amount" si está pending
      // El superadmin puede actualizar "status", "interest_rate", etc.
      const data = request.only([
        'amount',
        'reason',
        'status',
        'interest_rate',
        'approved_amount',
        'start_date',
        'end_date',
        'monthly_payment',
      ])

      financingReq.merge(data)
      await financingReq.save()

      return response.ok({
        status: 'success',
        message: 'Solicitud actualizada',
        data: financingReq,
      })
    } catch (error) {
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * DESTROY: Eliminar una solicitud
   */
  public async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const financingReq = await FinancingRequest.findOrFail(params.id)

      if (user.rol_id !== 1 && financingReq.user_id !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      await financingReq.delete()
      return response.ok({
        status: 'success',
        message: 'Solicitud de financiamiento eliminada',
      })
    } catch (error) {
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * APPROVE: Ruta para que el superadmin apruebe la solicitud (ejemplo)
   */
  public async approve({ auth, params, request, response }: HttpContext) {
    try {
      // Sólo superadmin
      if (auth.user!.rol_id !== 1) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      const financingReq = await FinancingRequest.findOrFail(params.id)
      const interestRate = request.input('interest_rate') || 0
      const approvedAmount = request.input('approved_amount') || financingReq.amount
      // Manejar calculo de pagos, etc.

      financingReq.status = 'approved'
      financingReq.interest_rate = interestRate
      financingReq.approved_amount = approvedAmount

      // Ejemplo de campos extra
      financingReq.start_date = request.input('start_date') // 'YYYY-MM-DD'
      financingReq.end_date = request.input('end_date')
      financingReq.monthly_payment = request.input('monthly_payment') // etc.

      await financingReq.save()

      return response.ok({
        status: 'success',
        message: 'Solicitud aprobada',
        data: financingReq,
      })
    } catch (error) {
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * REJECT: Rechazar una solicitud
   */
  public async reject({ auth, params, response }: HttpContext) {
    try {
      if (auth.user!.rol_id !== 1) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      const financingReq = await FinancingRequest.findOrFail(params.id)
      financingReq.status = 'rejected'
      await financingReq.save()

      return response.ok({
        status: 'success',
        message: 'Solicitud rechazada',
        data: financingReq,
      })
    } catch (error) {
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }
}

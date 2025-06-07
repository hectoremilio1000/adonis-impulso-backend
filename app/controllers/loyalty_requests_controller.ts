import LoyaltyCard from '#models/loyalty_card'
import LoyaltyProgram from '#models/loyalty_program'
import LoyaltyRequest from '#models/loyalty_request'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoyaltyRequestsController {
  /**
   * GET /loyalty/requests
   */
  public async index({ request }: HttpContext) {
    const userId = request.qs().user_id // <-- Nuevo
    const companyId = request.qs().company_id

    const query = LoyaltyRequest.query().preload('user').preload('company').orderBy('id', 'desc')

    // Filtro por company_id
    if (companyId) {
      query.where('company_id', companyId)
    }

    // Filtro por user_id
    if (userId) {
      query.where('user_id', userId)
    }

    const requests = await query
    return requests
  }
  /**
   * POST /loyalty/requests
   */
  public async store({ request, auth, response }: HttpContext) {
    console.log('store() => Authorization:', request.header('Authorization'))
    console.log('store() => auth.isLoggedIn:', auth.isAuthenticated)
    console.log('store() => auth.user:', auth.user)

    if (!auth.user) {
      console.log('store() => user is undefined, returning 401')
      return response.unauthorized({ message: 'No hay usuario autenticado' })
    }

    try {
      // LOG 1: ¿Qué llega en Authorization?
      const incomingAuthorization = request.header('Authorization')
      console.log('store() => Authorization header:', incomingAuthorization)

      // LOG 2: ¿Qué usuario detecta Adonis?
      console.log('store() => auth.user:', auth.user)

      // Verificar que esté logueado
      if (!auth.user) {
        console.log('store() => ¡No hay user en auth, respondemos 401!')
        return response.unauthorized({ message: 'No hay usuario autenticado' })
      }

      // LOG 3: Revisar el payload
      const data = request.only([
        'user_id',
        'company_id',
        'program_type',
        'required_visits',
        'required_products',
        'reward_description',
        'notes',
      ])
      console.log('store() => body data:', data)

      // (Opcional) Checar si auth.user es superadmin
      // if (auth.user.role !== 'superadmin') {
      //   console.log('store() => user no es superadmin, respondemos 403')
      //   return response.forbidden({ message: 'Solo superadmin puede crear requests' })
      // }

      const loyaltyRequest = await LoyaltyRequest.create({
        user_id: data.user_id,
        company_id: data.company_id || null,
        program_type: data.program_type,
        required_visits: data.required_visits,
        required_products: data.required_products,
        reward_description: data.reward_description,
        notes: data.notes,
        status: 'pending',
      })

      console.log('store() => ¡Request creado con éxito! ID:', loyaltyRequest.id)
      return loyaltyRequest
    } catch (error) {
      console.error('store() => Error en try-catch:', error)
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * GET /loyalty/requests/:id
   */
  public async show({ params, response }: HttpContext) {
    const requestRecord = await LoyaltyRequest.query()
      .where('id', params.id)
      .preload('user')
      .first()
    if (!requestRecord) {
      return response.notFound({ message: 'Request not found' })
    }
    return requestRecord
  }

  /**
   * PUT /loyalty/requests/:id
   */
  public async update({ params, request, response }: HttpContext) {
    const requestRecord = await LoyaltyRequest.find(params.id)
    if (!requestRecord) {
      return response.notFound({ message: 'Request not found' })
    }

    const data = request.only([
      'program_type',
      'required_visits',
      'required_products',
      'reward_description',
      'notes',
      'status',
    ])
    requestRecord.merge(data)
    await requestRecord.save()

    return requestRecord
  }

  /**
   * DELETE /loyalty/requests/:id
   */
  public async destroy({ params, response }: HttpContext) {
    const requestRecord = await LoyaltyRequest.find(params.id)
    if (!requestRecord) {
      return response.notFound({ message: 'Request not found' })
    }
    await requestRecord.delete()
    return { message: 'Request deleted' }
  }

  /**
   * POST /loyalty/requests/:id/approve
   */
  public async approve({ params, response, request }: HttpContext) {
    console.log('=== APPROVE Method Called ===')
    console.log('approve() => params.id:', params.id)
    console.log('approve() => HEADERS:', request.headers())
    console.log('approve() => body:', request.all()) // normal GET/POST data (likely empty, but in case there's something)

    try {
      const requestRecord = await LoyaltyRequest.query()
        .where('id', params.id)
        .preload('user')
        .first()

      console.log('approve() => requestRecord found:', !!requestRecord)

      if (!requestRecord) {
        console.log('approve() => Not found, returning 404')
        return response.notFound({ message: 'Request not found' })
      }

      console.log('approve() => user_id from requestRecord:', requestRecord.user_id)
      console.log('approve() => requestRecord JSON:', requestRecord.toJSON())

      // IMPORTANTE: Asegúrate de asignar user_id (si tu DB lo requiere)
      const program = await LoyaltyProgram.create({
        user_id: requestRecord.user_id, // la clave para no romper si la DB requiere user_id
        company_id: requestRecord.company_id, // <-- aquí
        name: `Prog de ${requestRecord.user_id}`,
        type: requestRecord.program_type,
        required_visits: requestRecord.required_visits,
        required_products: requestRecord.required_products,
        reward_description: requestRecord.reward_description,
        is_active: true,
      })

      console.log('approve() => Program created. ID:', program.id)

      const code = `CARD-${program.id}-${Date.now()}`
      const card = await LoyaltyCard.create({
        program_id: program.id,
        code,
        visits_count: 0,
        products_count: 0,
        redemptions_count: 0,
        is_active: true,
      })

      console.log('approve() => Card created. ID:', card.id)

      // Cambiamos el status
      requestRecord.status = 'approved'
      await requestRecord.save()

      console.log('approve() => Request status changed to approved')

      return {
        message: 'Request approved, program and card created',
        program_id: program.id,
        request: requestRecord,
      }
    } catch (error) {
      console.error('approve() => ERROR:', error)
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * POST /loyalty/requests/:id/reject
   */
  public async reject({ params, response }: HttpContext) {
    const requestRecord = await LoyaltyRequest.find(params.id)
    if (!requestRecord) {
      return response.notFound({ message: 'Request not found' })
    }
    if (requestRecord.status === 'rejected') {
      return response.badRequest({ message: 'Already rejected' })
    }

    requestRecord.status = 'rejected'
    await requestRecord.save()

    return { message: 'Request rejected', request: requestRecord }
  }
}

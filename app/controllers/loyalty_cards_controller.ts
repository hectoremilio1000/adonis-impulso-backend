import LoyaltyCard from '#models/loyalty_card'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoyaltyCardsController {
  // GET /loyalty/cards
  public async index({ request }: HttpContext) {
    const programId = request.input('program_id')
    const userId = request.input('user_id')

    const query = LoyaltyCard.query()
      .preload('program', (progQuery) => {
        progQuery.preload('company')
      })
      .preload('user')
      .orderBy('id', 'desc')

    // Filtro por program_id
    if (programId) {
      query.where('program_id', programId)
    }

    // Filtro por user_id
    if (userId) {
      query.where('user_id', userId)
    }

    const cards = await query
    return cards
  }

  // POST /loyalty/cards
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'program_id',
        'code',
        'visits_count',
        'products_count',
        'redemptions_count',
        'is_active',
        'customer_name',
        'user_id',
      ])
      if (!data.code) {
        data.code = `CARD-${Date.now()}-${Math.floor(Math.random() * 9999)}`
      }
      const card = await LoyaltyCard.create(data)
      return card
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  // GET /loyalty/cards/:id
  public async show({ params, response }: HttpContext) {
    const card = await LoyaltyCard.query()
      .where('id', params.id)
      .preload('program')
      .preload('user')
      .first()

    if (!card) {
      return response.notFound({ message: 'Card not found' })
    }
    return card
  }

  // PUT /loyalty/cards/:id
  public async update({ params, request, response }: HttpContext) {
    const card = await LoyaltyCard.find(params.id)
    if (!card) {
      return response.notFound({ message: 'Card not found' })
    }
    const data = request.only([
      'program_id',
      'code',
      'visits_count',
      'products_count',
      'redemptions_count',
      'is_active',
      'customer_name',
      'user_id',
    ])
    card.merge(data)
    await card.save()
    return card
  }

  // DELETE /loyalty/cards/:id
  public async destroy({ params, response }: HttpContext) {
    const card = await LoyaltyCard.find(params.id)
    if (!card) {
      return response.notFound({ message: 'Card not found' })
    }
    await card.delete()
    return { message: 'Card deleted successfully' }
  }

  // POST /loyalty/cards/:id/visit
  // En LoyaltyCardsController.ts
  public async incrementVisit({ params, auth, response }: HttpContext) {
    // 1) Verificamos si el usuario está autenticado
    if (!auth.user) {
      return response.unauthorized({ message: 'No estás autenticado' })
    }

    // 2) Cargamos la tarjeta y el programa
    const card = await LoyaltyCard.query()
      .where('id', params.id)
      .preload('program') // para tener program.required_visits y reward_description
      .first()

    if (!card) {
      return response.notFound({ message: 'Tarjeta no encontrada' })
    }

    // 3) Incrementamos las visitas en 1
    card.visits_count = (card.visits_count || 0) + 1

    let premio = null

    // 4) Checamos si es un programa de tipo "visits" y si llegó a la meta
    if (card.program.type === 'visits') {
      const required = card.program.required_visits || 0
      if (card.visits_count >= required) {
        // Significa que ya cumplió (o sobrepasó) el número de visitas requeridas

        // 4.1) Aumentamos el número de canjes
        card.redemptions_count = (card.redemptions_count || 0) + 1

        // 4.2) Guardamos el premio para notificar en la respuesta
        premio = card.program.reward_description

        // 4.3) Reseteamos el contador (o descuenta `required` si prefieres)
        card.visits_count = 0
      }
    }

    // 5) Guardamos la tarjeta actualizada
    await card.save()

    // 6) Retornamos un JSON indicando si hubo premio
    return {
      message: premio
        ? `Visita incrementada y se canjeó el premio: "${premio}"`
        : 'Visita incrementada',
      card,
      reward_description: premio,
    }
  }
}

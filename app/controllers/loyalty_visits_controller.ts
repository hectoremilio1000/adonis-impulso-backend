import LoyaltyCard from '#models/loyalty_card'
import LoyaltyVisit from '#models/loyalty_visit'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoyaltyVisitsController {
  // GET /loyalty/visits
  public async index({}: HttpContext) {
    return await LoyaltyVisit.query().preload('card').orderBy('id', 'desc')
  }

  // POST /loyalty/visits
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['card_id', 'visit_date', 'notes'])
      // Verificamos que la card exista
      const card = await LoyaltyCard.find(data.card_id)
      if (!card) {
        return response.notFound({ message: 'Card not found' })
      }

      // Creamos la visita
      const visit = await LoyaltyVisit.create(data)

      // (Opcional) si es un programa de "visits", incrementamos visits_count:
      //   - Podríamos cargar el program para validar:
      await card.load('program')
      if (card.program.type === 'visits') {
        card.visits_count += 1
        await card.save()
      }

      // (Si fuera "products", no haríamos nada aquí,
      //  pues a lo mejor tenemos otra ruta para registrar compra de producto)

      return visit
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  // GET /loyalty/visits/:id
  public async show({ params, response }: HttpContext) {
    const visit = await LoyaltyVisit.query().where('id', params.id).preload('card').first()

    if (!visit) {
      return response.notFound({ message: 'Visit not found' })
    }
    return visit
  }

  // PUT /loyalty/visits/:id
  public async update({ params, request, response }: HttpContext) {
    const visit = await LoyaltyVisit.find(params.id)
    if (!visit) {
      return response.notFound({ message: 'Visit not found' })
    }
    const data = request.only(['visit_date', 'notes'])
    visit.merge(data)
    await visit.save()
    return visit
  }

  // DELETE /loyalty/visits/:id
  public async destroy({ params, response }: HttpContext) {
    const visit = await LoyaltyVisit.find(params.id)
    if (!visit) {
      return response.notFound({ message: 'Visit not found' })
    }
    await visit.delete()
    return { message: 'Visit deleted successfully' }
  }
}

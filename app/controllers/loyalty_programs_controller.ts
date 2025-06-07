import LoyaltyCard from '#models/loyalty_card'
import LoyaltyProgram from '#models/loyalty_program'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoyaltyProgramsController {
  // GET /loyalty/programs
  // GET /loyalty/programs
  public async index({ request }: HttpContext) {
    console.log('=== [LoyaltyProgramsController.index] => Listar Programas ===')

    const userId = request.qs().user_id // <-- Nuevo
    const companyId = request.qs().company_id

    const query = LoyaltyProgram.query().preload('owner').preload('company').orderBy('id', 'desc')

    // Filtro por company_id
    if (companyId) {
      query.where('company_id', companyId)
    }

    // Filtro por user_id
    if (userId) {
      query.where('user_id', userId)
    }

    const programs = await query
    return programs
  }

  // POST /loyalty/programs

  public async store({ request, response, auth }: HttpContext) {
    try {
      // 1. Leer campos para el Program
      interface ProgramPayload {
        name: string
        type: 'visits' | 'products'
        required_visits?: number
        required_products?: number
        reward_description?: string
        is_active?: boolean
        user_id?: number
        company_id?: number // si manejas company
      }

      const data = request.only([
        'name',
        'type',
        'required_visits',
        'required_products',
        'reward_description',
        'is_active',
        'company_id', // <-- si lo manejas
      ]) as ProgramPayload

      // 2. Asignar el user_id del admin logueado
      data.user_id = auth.user!.id

      // 3. Crear el programa
      const program = await LoyaltyProgram.create(data)

      // 4. Generar code de la tarjeta
      const code = `CARD-${program.id}-${Date.now()}`

      // 5. Crear la tarjeta asociada
      //    (visits_count=0, products_count=0, etc.)
      const card = await LoyaltyCard.create({
        program_id: program.id,
        code,
        visits_count: 0,
        products_count: 0,
        redemptions_count: 0,
        is_active: true,
        // Si quieres "customer_name", puedes recibirlo también en el request
        // o poner un valor fijo
        customer_name: request.input('customer_name') || null,
      })

      // 6. Retornar ambos
      return {
        message: 'Programa creado y tarjeta generada',
        program,
        card,
      }
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async show({ params, response }: HttpContext) {
    const program = await LoyaltyProgram.query()
      .where('id', params.id)
      .preload('owner')
      .preload('company')
      .first()

    if (!program) {
      return response.notFound({ message: 'Program not found' })
    }
    return program
  }

  // PUT /loyalty/programs/:id
  public async update({ params, request, response }: HttpContext) {
    const program = await LoyaltyProgram.find(params.id)
    if (!program) {
      return response.notFound({ message: 'Program not found' })
    }
    const data = request.only([
      'name',
      'type',
      'required_visits',
      'required_products',
      'reward_description',
      'is_active',
      'company_id', // si manejas
    ])
    program.merge(data)
    await program.save()
    return program
  }

  // DELETE /loyalty/programs/:id
  public async destroy({ params, response }: HttpContext) {
    const program = await LoyaltyProgram.find(params.id)
    if (!program) {
      return response.notFound({ message: 'Program not found' })
    }
    await program.delete()
    return { message: 'Program deleted successfully' }
  }
  public async cardsByProgram({ params, response }: HttpContext) {
    const program = await LoyaltyProgram.find(params.programId)
    if (!program) {
      return response.notFound({ message: 'Program not found' })
    }
    // Query all cards with that program_id
    const cards = await LoyaltyCard.query()
      .where('program_id', program.id)
      .preload('user')
      .preload('program') // si deseas ver info del programa
      .orderBy('id', 'asc')
    return cards
  }
}

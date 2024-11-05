import Plan from '#models/plan'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlansController {
  // Listar todos los planes (GET /plans)
  public async index({}: HttpContext) {
    const plans = await Plan.all()
    return plans
  }

  // Mostrar un plan individual por ID (GET /plans/:id)
  public async show({ params }: HttpContext) {
    console.log(params)
    const plan = await Plan.findOrFail(params.id)
    console.log(plan)
    return plan
  }

  // Crear un nuevo plan (POST /plans)
  public async store({ request }: HttpContext) {
    const data = request.only(['name', 'price', 'description', 'created_by', 'active']) // Asume que estos campos existen
    const plan = await Plan.create(data)
    return plan
  }

  // Actualizar un plan existente (PUT /plans/:id)
  public async update({ params, request }: HttpContext) {
    console.log(params)
    const plan = await Plan.findOrFail(params.id)
    const data = request.only(['name', 'price', 'description', 'created_by', 'active'])
    plan.merge(data)
    await plan.save()
    return plan
  }

  // Eliminar un plan (DELETE /plans/:id)
  public async destroy({ params }: HttpContext) {
    const plan = await Plan.findOrFail(params.id)
    await plan.delete()
    return { message: 'Plan deleted successfully' }
  }
}

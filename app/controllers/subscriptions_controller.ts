import Subscription from '#models/subscription'
import type { HttpContext } from '@adonisjs/core/http'

export default class SubscriptionsController {
  // Listar todos los subscripciones (GET /subscriptions)
  public async index({}: HttpContext) {
    try {
      const subscriptions = await Subscription.query()

      return {
        status: 'success',
        code: 200,
        message: 'Modules fetched successfully',
        data: subscriptions,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching subscriptions',
        error: error.message,
      }
    }
  }

  // Mostrar un subscription individual por ID (GET /subscriptions/:id)
  public async show({ params }: HttpContext) {
    console.log(params)
    const subscription = await Subscription.query().where('id', params.id).firstOrFail() // Cargar módulos relacionados
    return subscription
  }
  // Mostrar un plan individual por ID (GET /plans/:id)
  public async subscriptionbyuser({ params }: HttpContext) {
    try {
      const plan = await Subscription.query()
        .where('user_id', params.id)
        .preload('plan', (planQuery) => {
          planQuery.preload('modules') // Cargar el plan asociado a la suscripción
        })
        .firstOrFail()
      return {
        status: 'success',
        code: 200,
        message: 'Modules fetched successfully',
        data: plan,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching subscriptions',
        error: error.message,
      }
    }
  }

  // Crear un nuevo subscription (POST /subscriptions)
  public async store({ request, auth }: HttpContext) {
    try {
      await auth.check()

      const data = request.only(['user_id', 'plan_id', 'start_date', 'end_date', 'status']) // Asume que estos campos existen
      const userId = auth.user?.id

      // Crear el subscription
      const subscription = await Subscription.create({
        user_id: data.user_id,
        plan_id: data.plan_id,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        created_by: userId,
      })

      return {
        status: 'success',
        code: 201,
        message: 'subscription creado correctamente con módulos asociados',
        data: subscription,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creating subscription',
        error: error.message,
      }
    }
  }

  // Actualizar un subscription existente (PUT /subscriptions/:id)
  public async update({ params, request }: HttpContext) {
    console.log(params)
    const subscription = await Subscription.findOrFail(params.id)
    const data = request.only(['name', 'price', 'description', 'created_by', 'active'])
    subscription.merge(data)
    await subscription.save()
    return subscription
  }

  // Eliminar un subscription (DELETE /subscriptions/:id)
  public async destroy({ params }: HttpContext) {
    const subscription = await Subscription.findOrFail(params.id)
    await subscription.delete()
    return { message: 'subscription deleted successfully' }
  }
}

import Company from '#models/company'
import type { HttpContext } from '@adonisjs/core/http'

export default class CompaniesController {
  async index({ auth }: HttpContext) {
    await auth.check()
    try {
      const user = auth.user!
      if (user.rol_id === 1) {
        // Superadmin
        const businesses = await Company.query()
          .preload('admin', (adminQuery) => {
            adminQuery.preload('subscriptions', (subscriptionQuery) => {
              subscriptionQuery
                .preload('plan') // Cargar el plan asociado a la suscripción
                .orderBy('end_date', 'desc') // Ordenar por fecha de fin en orden descendente
            })
          })
          .preload('sedes')
        return {
          status: 'success',
          code: 200,
          message: 'Modules fetched successfully',
          data: businesses,
        }
      } else if (user.rol_id === 2) {
        // Admin
        const businesses = await Company.query().where('user_id', user.id).preload('sedes')
        return {
          status: 'success',
          code: 200,
          message: 'Modules fetched successfully',
          data: businesses,
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching companias',
        error: error.message,
      }
    }
  }

  async store({ request, auth }: HttpContext) {
    try {
      await auth.check()
      const userId = auth.user?.id
      const data = request.only(['name', 'email', 'logo', 'website', 'phone_contact', 'user_id'])
      const business = await Company.create({ ...data, created_by: userId })

      return {
        status: 'success',
        code: 201,
        message: 'Plan creado correctamente con módulos asociados',
        data: business,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creating plan',
        error: error.message,
      }
    }
  }

  async show({ params }: HttpContext) {
    const business = await Company.findOrFail(params.id)

    return business
  }

  async getSedes({ params }: HttpContext) {
    const business = await Company.findOrFail(params.id)
    const sedes = await business.related('sedes').query()

    return sedes
  }
}

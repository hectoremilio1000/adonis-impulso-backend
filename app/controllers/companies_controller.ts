import Company from '#models/company'
import type { HttpContext } from '@adonisjs/core/http'

export default class CompaniesController {
  async index({ auth }: HttpContext) {
    await auth.check()
    try {
      const user = auth.user!
      if (user.rol_id === 1) {
        // Superadmin
        const businesses = await Company.query().preload('admin').preload('sedes')
        console.log(businesses)
        return {
          status: 'success',
          code: 200,
          message: 'Modules fetched successfully',
          data: businesses,
        }
      } else if (user.rol_id === 2) {
        // Admin
        const businesses = await Company.query().where('user_id', user.id)
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
        message: 'Error fetching modules',
        error: error.message,
      }
    }
  }

  async store({ request, auth }: HttpContext) {
    const user = auth.user!
    if (user.rol_id === 1) {
      const data = request.only(['name', 'email', 'logo', 'website', 'phone_contact', 'user_id'])
      const business = await Company.create({ ...data, created_by: user.id })
      return business
    } else {
      const admin = auth.user!
      const data = request.only(['name', 'email', 'logo', 'website', 'phone_contact'])
      const business = await Company.create({ ...data, user_id: admin.id, created_by: admin.id })
      return business
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

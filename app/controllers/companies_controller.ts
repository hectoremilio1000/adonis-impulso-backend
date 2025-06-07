import Company from '#models/company'
import type { HttpContext } from '@adonisjs/core/http'

export default class CompaniesController {
  public async index({ auth, request }: HttpContext) {
    await auth.check()
    try {
      const user = auth.user!
      const rolId = user.rol_id

      // Tomamos ?ownerId=xxx para filtrar, solo si es superadmin
      const ownerId = request.input('ownerId')

      if (rolId === 1) {
        // SUPERADMIN
        // Construimos un query base
        let query = Company.query().preload('admin').preload('employees')

        if (ownerId) {
          // Filtrar por user_id = ownerId
          query = query.where('user_id', ownerId)
        }

        const companies = await query
        return {
          status: 'success',
          data: companies,
        }
      } else if (rolId === 2) {
        // ADMIN => ver solo sus empresas
        const list = await Company.query()
          .where('user_id', user.id)
          .preload('admin')
          .preload('employees')

        return {
          status: 'success',
          data: list,
        }
      } else {
        // Empleado u otro rol => por ahora array vacío
        return {
          status: 'success',
          data: [],
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      return {
        status: 'error',
        message: 'Error fetching companies',
        error: error.message,
      }
    }
  }

  /**
   * POST /api/companies
   * Crea una nueva empresa.
   * - Si es superadmin, puede asignar la empresa a cualquier user_id.
   * - Si es admin, forzamos user_id = auth.user.id
   */
  public async store({ request, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      // Tomar campos
      const data = request.only([
        'name',
        'email',
        'phone_contact',
        'website',
        'logo',
        'user_id', // esto viene del front, pero se usará solo si es superadmin
      ])

      // Determinar userId final
      let finalUserId = data.user_id
      if (user.rol_id === 2) {
        // Si es admin, se asigna a sí mismo
        finalUserId = user.id
      }

      // Crear la nueva empresa
      const newCompany = await Company.create({
        name: data.name,
        email: data.email,
        phone_contact: data.phone_contact,
        website: data.website,
        logo: data.logo,
        user_id: finalUserId,
        created_by: user.id, // El que la creó
      })

      return {
        status: 'success',
        message: 'Company created successfully',
        data: newCompany,
      }
    } catch (error) {
      console.error('Error creating company:', error)
      return {
        status: 'error',
        message: 'Error creating company',
        error: error.message,
      }
    }
  }

  /**
   * GET /api/companies/:id
   * Retorna una sola empresa y precarga `admin` y `employees`.
   */
  public async show({ params, response }: HttpContext) {
    try {
      const company = await Company.findOrFail(params.id)
      await company.load((loader) => {
        loader.load('admin').load('employees')
      })
      return {
        status: 'success',
        data: company,
      }
    } catch (error) {
      console.error('Error fetching company:', error)
      return response.status(404).json({
        status: 'error',
        message: 'Empresa no encontrada',
      })
    }
  }

  /**
   * PUT /api/companies/:id
   * Actualiza una empresa:
   * - Si es superadmin, puede cambiar el user_id si quiere.
   * - Si es admin y no es dueño, error 403.
   * - Si es admin y sí es dueño, no puede cambiar user_id.
   */
  public async update({ params, request, response, auth }: HttpContext) {
    try {
      await auth.check()

      const user = auth.user!
      const company = await Company.findOrFail(params.id)

      // Check permisos
      // superadmin => OK
      // admin => solo si company.userId == user.id
      if (user.rol_id !== 1 && user.id !== company.user_id) {
        return response.status(403).json({
          status: 'error',
          message: 'No tienes permisos para editar esta empresa',
        })
      }

      const data = request.only(['name', 'email', 'phone_contact', 'website', 'logo', 'user_id'])

      // Si es admin, no puede cambiar user_id
      if (user.rol_id === 2) {
        data.user_id = company.user_id // Forzamos que permanezca igual
      }

      // Mezclamos
      company.merge({
        name: data.name,
        email: data.email,
        phone_contact: data.phone_contact,
        website: data.website,
        logo: data.logo,
        // Solo superadmin puede cambiar user_id
        user_id: data.user_id || company.user_id,
      })

      await company.save()

      return {
        status: 'success',
        message: 'Empresa actualizada correctamente',
        data: company,
      }
    } catch (error) {
      console.error('Error updating company:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al actualizar empresa',
        error: error.message,
      })
    }
  }

  /**
   * GET /api/companies/:id/sedes
   * (Opcional) Si manejas sedes en la relación .hasMany('sedes')
   */
  public async getSedes({ params, response }: HttpContext) {
    try {
      const business = await Company.findOrFail(params.id)
      const sedes = await business.related('sedes').query()
      return {
        status: 'success',
        data: sedes,
      }
    } catch (error) {
      console.error('Error getting sedes:', error)
      return response.status(404).json({
        status: 'error',
        message: 'No se encontraron sedes para esta empresa',
      })
    }
  }
}

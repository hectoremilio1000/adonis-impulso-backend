import Successcase from '#models/successcase'
import type { HttpContext } from '@adonisjs/core/http'

export default class SuccesscasesController {
  async index() {
    // await auth.check()
    try {
      // const user = auth.user!
      // if (user.rol_id === 1) {
      // Superadmin
      const successcases = await Successcase.query().preload('sections')
      return {
        status: 'success',
        code: 200,
        message: 'Case studies fetched successfully',
        data: successcases,
      }
      // } else {
      //   return {
      //     status: 'error',
      //     code: 500,
      //     message: 'No eres tienes permisos listar casos de estudio',
      //     error: 'No eres tienes permisos listar casos de estudio',
      //   }
      // }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching companias',
        error: error.message,
      }
    }
  }

  async store({ request }: HttpContext) {
    try {
      const data = request.only(['title', 'description', 'image'])
      const successcases = await Successcase.create(data)

      return {
        status: 'success',
        code: 201,
        message: 'Caso de estudio creado correctamente',
        data: successcases,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creatin success case',
        error: error.message,
      }
    }
  }

  async show({ params }: HttpContext) {
    const successcase = await Successcase.findOrFail(params.id)
    return successcase
  }

  async getSections({ params }: HttpContext) {
    const successcase = await Successcase.findOrFail(params.id)
    const sections = await successcase.related('sections').query()

    return sections
  }
}

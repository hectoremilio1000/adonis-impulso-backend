import Response from '#models/response'
import type { HttpContext } from '@adonisjs/core/http'

export default class ResponsesController {
  // Listar todos los planes (GET /plans)
  public async index({}: HttpContext) {
    const responses = await Response.all()
    return responses
  }

  // Mostrar un plan individual por ID (GET /plans/:id)
  public async show({ params }: HttpContext) {
    console.log(params)
    const response = await Response.findOrFail(params.id)
    console.log(response)
    return response
  }

  // Crear un nuevo rol (POST /plans)
  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['prospect_id', 'option_id']) // Asume que estos campos existen
      const response = await Response.create(data)

      return {
        status: 'success',
        code: 200,
        message: 'Response fetched succesfully',
        data: response,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error create response',
        error: error.message,
      }
    }
  }
  // Crear un nuevo rol (POST /plans)
  public async responsesByGroup({ request }: HttpContext) {
    try {
      const data = request.only(['responses']) // Asume que estos campos existen
      console.log(data)
      // Asociar módulos al plan
      if (data.responses && Array.isArray(data.responses)) {
        await Response.createMany(data.responses) // Guardar las asociaciones en la tabla intermedia
      }
      return {
        status: 'success',
        code: 200,
        message: 'Response fetched succesfully',
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error create response',
        error: error.message,
      }
    }
  }
}

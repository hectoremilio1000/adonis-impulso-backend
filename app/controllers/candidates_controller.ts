import Candidate from '#models/candidate'
import type { HttpContext } from '@adonisjs/core/http'

export default class CandidatesController {
  // Listar todos los modules (GET /modules)
  public async index({}: HttpContext) {
    try {
      const candidates = await Candidate.all()
      return {
        status: 'success',
        code: 200,
        message: 'Candidates fetched successfully',
        data: candidates,
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

  // Mostrar un module individual por ID (GET /modules/:id)
  public async show({ params }: HttpContext) {
    try {
      const candidate = await Candidate.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Module fetched successfully',
        data: candidate,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 404,
        message: 'Module not found',
        error: error.message,
      }
    }
  }

  // Crear un nuevo module (POST /modules)
  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['candidate']) // Asume que estos campos existen

      if (data) {
        const candidate = await Candidate.create(data.candidate)
        // Crear el nuevo module con el `created_by` del usuario autenticado

        return {
          status: 'success',
          code: 201,
          message: 'Candidate created successfully',
          data: candidate,
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error creating module',
        error: error.message,
      }
    }
  }
}

import CandidateIdeal from '#models/candidate_ideal'
import type { HttpContext } from '@adonisjs/core/http'

export default class CandidateIdealsController {
  // Listar todos los modules (GET /modules)
  public async index({}: HttpContext) {
    try {
      const cnadidate_ideals = await CandidateIdeal.all()
      return {
        status: 'success',
        code: 200,
        message: 'cnadidate_ideals fetched successfully',
        data: cnadidate_ideals,
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
      const candidate_ideal = await CandidateIdeal.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Module fetched successfully',
        data: candidate_ideal,
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
      const data = request.only(['candidate_ideal']) // Asume que estos campos existen

      if (data) {
        const candidate_ideal = await CandidateIdeal.create(data.candidate_ideal)
        // Crear el nuevo module con el `created_by` del usuario autenticado

        return {
          status: 'success',
          code: 201,
          message: 'candidate_ideal created successfully',
          data: candidate_ideal,
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
  // Crear un nuevo module (POST /modules)
  public async getCandidateIdealByPuesto({ params }: HttpContext) {
    try {
      const puesto = params.puesto // Asume que estos campos existen
      const candidate_ideal = await CandidateIdeal.query().where('puesto', puesto)

      return {
        status: 'success',
        code: 201,
        message: 'candidate_ideal updated successfully',
        data: candidate_ideal,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error get candidate ideal for puesto ',
        error: error.message,
      }
    }
  }
}

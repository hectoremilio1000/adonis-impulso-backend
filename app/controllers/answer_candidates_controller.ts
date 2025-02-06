import AnswerCandidate from '#models/answer_candidate'
import type { HttpContext } from '@adonisjs/core/http'

export default class AnswerCandidatesController {
  // Listar todos los answer candidates (GET /modules)
  public async index({}: HttpContext) {
    try {
      const exams = await AnswerCandidate.all()
      return {
        status: 'success',
        code: 200,
        message: 'Answer candidates fetched successfully',
        data: exams,
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

  // Mostrar un answer individual por ID (GET /modules/:id)
  public async show({ params }: HttpContext) {
    try {
      const exam = await AnswerCandidate.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Module fetched successfully',
        data: exam,
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
      const data = request.only(['answer_candidate']) // Asume que estos campos existen

      if (data) {
        const exam = await AnswerCandidate.create(data.answer_candidate)
        return {
          status: 'success',
          code: 201,
          message: 'exam created successfully',
          data: exam,
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

  public async answerCandidatesByGroup({ request }: HttpContext) {
    try {
      const data = request.only(['answer_candidates'])
      console.log(data)
      if (data.answer_candidates && Array.isArray(data.answer_candidates)) {
        await AnswerCandidate.createMany(data.answer_candidates)
      }
      return {
        status: 'success',
        code: 200,
        message: 'Answer Candidates fetched succesfully',
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error create response aqui',
        error: error.message,
      }
    }
  }
  public async getAttempAnswer({ params }: HttpContext) {
    const { candidateId } = params
    try {
      // Obtener el último intento del candidato
      const lastAttempt = await AnswerCandidate.query()
        .where('candidate_id', candidateId)
        .max('attempt as max_attempt') // Obtener el máximo valor de 'attempt'
        .first()
      console.log(lastAttempt)
      if (!lastAttempt || lastAttempt.max_attempt === null) {
        return {
          status: 'error',
          code: 500,
          message: 'Error fetching last attemp',
        }
      }
      const newLast = {
        candidate_id: candidateId,
        last_attempt: lastAttempt.max_attempt,
      }
      return {
        status: 'success',
        code: 200,
        message: 'Last attemp fetched successfully',
        data: newLast,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching last attemp',
        error: error.message,
      }
    }
  }
}

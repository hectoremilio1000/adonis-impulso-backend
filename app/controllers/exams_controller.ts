import Exam from '#models/exam'
import type { HttpContext } from '@adonisjs/core/http'

export default class ExamsController {
  // Listar todos los modules (GET /modules)
  public async index({}: HttpContext) {
    try {
      const exams = await Exam.all()
      return {
        status: 'success',
        code: 200,
        message: 'exams fetched successfully',
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
  public async query({ request }: HttpContext) {
    // Obtener parámetros de consulta
    const data = request.qs() // "Psicosometricos"
    const typeExamen = data.type_exam // "Psicosometricos"
    const puesto = data.puesto // "mozo"
    console.log(data)
    try {
      // Construir la consulta dinámica
      const examsQuery = Exam.query()

      if (typeExamen) {
        console.log('tipo de examen')
        examsQuery.where('type', typeExamen) // Filtrar por "type_examen"
      }

      if (puesto) {
        console.log('puesto')
        examsQuery.where('name', puesto) // Filtrar por "puesto"
      }
      // Ejecutar la consulta
      const exams = await examsQuery.preload('questions_candidates')
      return {
        status: 'success',
        code: 200,
        message: 'exams fetched successfully',
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

  // Mostrar un module individual por ID (GET /modules/:id)
  public async show({ params }: HttpContext) {
    try {
      const exam = await Exam.findOrFail(params.id)
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
      const data = request.only(['exam']) // Asume que estos campos existen

      if (data) {
        const exam = await Exam.create(data.exam)
        // Crear el nuevo module con el `created_by` del usuario autenticado

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
}

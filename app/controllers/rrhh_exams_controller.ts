import RrhhExam from '#models/rrhh_exam'
import type { HttpContext } from '@adonisjs/core/http'

export default class RrhhExamsController {
  // GET /api/rrhh/exams
  public async index({}: HttpContext) {
    try {
      // preload("preguntas") => para traer también sus preguntas
      const exams = await RrhhExam.query().preload('preguntas')
      return {
        status: 'success',
        data: exams,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error fetching rrhh_exams',
        error: error.message,
      }
    }
  }

  // GET /api/rrhh/exams/:id
  public async show({ params }: HttpContext) {
    try {
      // preload preguntas
      const exam = await RrhhExam.query().where('id', params.id).preload('preguntas').firstOrFail()

      return {
        status: 'success',
        data: exam,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Exam not found',
        error: error.message,
      }
    }
  }

  // POST /api/rrhh/exams
  public async store({ request }: HttpContext) {
    try {
      // Sencillo: creamos un examen recibiendo { nombre, tipo, version, activo }
      const { nombre, tipo, version, activo } = request.only([
        'nombre',
        'tipo',
        'version',
        'activo',
      ])

      const exam = await RrhhExam.create({
        nombre,
        tipo,
        version,
        activo,
      })

      return {
        status: 'success',
        message: 'Exam created',
        data: exam,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error creating exam',
        error: error.message,
      }
    }
  }

  // PUT /api/rrhh/exams/:id
  public async update({ params, request }: HttpContext) {
    try {
      const exam = await RrhhExam.findOrFail(params.id)
      const { nombre, tipo, version, activo } = request.only([
        'nombre',
        'tipo',
        'version',
        'activo',
      ])

      exam.merge({ nombre, tipo, version, activo })
      await exam.save()

      return {
        status: 'success',
        message: 'Exam updated',
        data: exam,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error updating exam',
        error: error.message,
      }
    }
  }

  // DELETE /api/rrhh/exams/:id
  public async destroy({ params }: HttpContext) {
    try {
      const exam = await RrhhExam.findOrFail(params.id)
      await exam.delete()

      return {
        status: 'success',
        message: 'Exam deleted',
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error deleting exam',
        error: error.message,
      }
    }
  }
}

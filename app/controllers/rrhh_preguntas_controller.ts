import RrhhPregunta from '#models/rrhh_pregunta'
import type { HttpContext } from '@adonisjs/core/http'
import { nanoid } from 'nanoid'

export default class RrhhPreguntasController {
  // GET /api/rrhh/preguntas
  public async index({}: HttpContext) {
    try {
      // preload('examen') => para traer info del examen
      const preguntas = await RrhhPregunta.query().preload('examen')
      return {
        status: 'success',
        data: preguntas,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error fetching rrhh_preguntas',
        error: error.message,
      }
    }
  }

  // GET /api/rrhh/preguntas/:id
  public async show({ params }: HttpContext) {
    try {
      const pregunta = await RrhhPregunta.query()
        .where('id', params.id)
        .preload('examen')
        .preload('respuestas') // si quieres traer sus respuestas
        .firstOrFail()

      return {
        status: 'success',
        data: pregunta,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Pregunta not found',
        error: error.message,
      }
    }
  }

  // POST /api/rrhh/preguntas
  public async store({ request }: HttpContext) {
    try {
      // Se asume que el front envía { examen_id, texto, peso_pregunta, ... } etc.
      const data = request.only([
        'examen_id',
        'texto',
        'peso_pregunta',
        'a',
        'peso_a',
        'b',
        'peso_b',
        'c',
        'peso_c',
        'd',
        'peso_d',
        'e',
        'peso_e',
        'respuesta_correcta',
      ])

      const pregunta = await RrhhPregunta.create(data)

      return {
        status: 'success',
        message: 'Pregunta created',
        data: pregunta,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error creating pregunta',
        error: error.message,
      }
    }
  }

  // PUT /api/rrhh/preguntas/:id
  public async update({ params, request }: HttpContext) {
    try {
      const pregunta = await RrhhPregunta.findOrFail(params.id)

      const data = request.only([
        'examen_id',
        'texto',
        'peso_pregunta',
        'a',
        'peso_a',
        'b',
        'peso_b',
        'c',
        'peso_c',
        'd',
        'peso_d',
        'e',
        'peso_e',
        'respuesta_correcta',
      ])

      pregunta.merge(data)
      await pregunta.save()

      return {
        status: 'success',
        message: 'Pregunta updated',
        data: pregunta,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error updating pregunta',
        error: error.message,
      }
    }
  }

  // DELETE /api/rrhh/preguntas/:id
  public async destroy({ params }: HttpContext) {
    try {
      const pregunta = await RrhhPregunta.findOrFail(params.id)
      await pregunta.delete()

      return {
        status: 'success',
        message: 'Pregunta deleted',
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error deleting pregunta',
        error: error.message,
      }
    }
  }
  public async iniciarExamen({ request, response }: HttpContext) {
    try {
      const { candidatoId } = request.body() // lo que mandas desde tu front

      // Genera un intentoId. Podrías también guardar esto en tu BD si quieres
      const intentoId = `intento-${Date.now()}-${candidatoId}-${nanoid(5)}`

      // (Opcional) puedes guardar en “exams_candidates” o en “intentos_examen”
      // algo como:
      // await ExamCandidate.create({ candidate_id: candidatoId, puesto, etapa, intento_id: intentoId })

      return response.json({ status: 'success', intentoId })
    } catch (error) {
      return response
        .status(500)
        .json({ status: 'error', message: error.message || 'Error iniciando examen' })
    }
  }

  /**
   * (Opcional) POST /api/rrhh/preguntas/obtener
   * Para obtener las preguntas según el puesto y/o la etapa
   */
  public async obtenerPreguntas({ request, response }: HttpContext) {
    try {
      const { puesto } = request.body()

      // 1. Identifica qué exam_id corresponde al puesto (ej. Mesero => exam_id=2)
      //    y también examenes psicométricos => 49, 50, 51, etc.
      // 2. Haz un query a RrhhPregunta para obtenerlas

      // Ejemplo súper simplificado (todo en un array):
      const examenesPsico = [49, 50, 51, 52, 53, 54, 55] // IDs de tus exámenes psicométricos
      let examenesConocimiento = [] as number[]

      if (puesto === 'Mesero') examenesConocimiento = [2]
      else if (puesto === 'Gerente') examenesConocimiento = [3]
      // etc. Mapea según tus IDs

      const idsExamenes = [...examenesPsico, ...examenesConocimiento]

      // Consulta las preguntas:
      const preguntas = await RrhhPregunta.query().whereIn('examen_id', idsExamenes)

      return response.json({
        status: 'success',
        preguntas,
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: error.message || 'Error obteniendo preguntas',
      })
    }
  }
}

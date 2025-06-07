import RrhhPregunta from '#models/rrhh_pregunta'
import RrhhRespuesta from '#models/rrhh_respuesta'
import type { HttpContext } from '@adonisjs/core/http'

export default class RrhhRespuestasController {
  // GET /api/rrhh/respuestas
  public async index({ request }: HttpContext) {
    try {
      const candidatoId = request.qs().candidatoId
      const intentoId = request.qs().intentoId

      const query = RrhhRespuesta.query()
        // preload de la relación "pregunta" y su "examen"
        .preload('pregunta', (q) => {
          q.preload('examen')
        })
        .preload('examen') // si quieres
        .preload('candidato') // si quieres

      if (candidatoId) {
        query.where('candidato_id', candidatoId)
      }
      if (intentoId) {
        query.where('intento_id', intentoId)
      }

      const respuestas = await query

      return {
        status: 'success',
        data: respuestas,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error fetching rrhh_respuestas',
        error: error.message,
      }
    }
  }

  // GET /api/rrhh/respuestas/:id
  public async show({ params }: HttpContext) {
    try {
      const respuesta = await RrhhRespuesta.query()
        .where('id', params.id)
        .preload('candidato')
        .preload('pregunta')
        .preload('examen')
        .firstOrFail()

      return {
        status: 'success',
        data: respuesta,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Respuesta not found',
        error: error.message,
      }
    }
  }

  // POST /api/rrhh/respuestas
  public async store({ request }: HttpContext) {
    try {
      // Aquí guardamos UNA sola respuesta. Si quieres guardar varias, tendrás que adaptarlo.
      const data = request.only([
        'candidato_id',
        'pregunta_id',
        'respuesta_seleccionada',
        'peso_respuesta',
        'es_correcta',
        'intento_id',
        'timestamp',
        'examen_id',
        'nombre_examen',
        'version_examen',
        'peso_pregunta',
      ])

      const respuesta = await RrhhRespuesta.create(data)
      return {
        status: 'success',
        message: 'Respuesta created',
        data: respuesta,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error creating respuesta',
        error: error.message,
      }
    }
  }

  // PUT /api/rrhh/respuestas/:id
  public async update({ params, request }: HttpContext) {
    try {
      const respuesta = await RrhhRespuesta.findOrFail(params.id)

      const data = request.only([
        'candidato_id',
        'pregunta_id',
        'respuesta_seleccionada',
        'peso_respuesta',
        'es_correcta',
        'intento_id',
        'timestamp',
        'examen_id',
        'nombre_examen',
        'version_examen',
        'peso_pregunta',
      ])

      respuesta.merge(data)
      await respuesta.save()

      return {
        status: 'success',
        message: 'Respuesta updated',
        data: respuesta,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error updating respuesta',
        error: error.message,
      }
    }
  }

  // DELETE /api/rrhh/respuestas/:id
  public async destroy({ params }: HttpContext) {
    try {
      const respuesta = await RrhhRespuesta.findOrFail(params.id)
      await respuesta.delete()

      return {
        status: 'success',
        message: 'Respuesta deleted',
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error deleting respuesta',
        error: error.message,
      }
    }
  }
  public async storeMasivo({ request, response }: HttpContext) {
    try {
      const { candidatoId, respuestas } = request.body()

      // 1) Determinamos el nuevo intento_id
      const row = await RrhhRespuesta.query()
        .where('candidato_id', candidatoId)
        .max('intento_id as max_intento')
        .first()

      const ultimoIntento = row?.$extras?.max_intento ?? 0
      const nuevoIntento = ultimoIntento + 1

      // 2) Recorremos cada respuesta del frontend
      for (const r of respuestas) {
        // 2a) Obtenemos la pregunta
        const pregunta = await RrhhPregunta.findOrFail(r.pregunta_id)

        // 2b) Verificamos si es correcta
        const esCorrecta = r.respuesta_seleccionada === pregunta.respuesta_correcta ? 1 : 0

        // 2c) Determinamos peso_respuesta según la opción elegida
        let pesoRespuesta = 0
        if (r.respuesta_seleccionada === 'a') {
          pesoRespuesta = pregunta.peso_a
        } else if (r.respuesta_seleccionada === 'b') {
          pesoRespuesta = pregunta.peso_b
        } else if (r.respuesta_seleccionada === 'c') {
          pesoRespuesta = pregunta.peso_c
        } else if (r.respuesta_seleccionada === 'd') {
          pesoRespuesta = pregunta.peso_d
        } else if (r.respuesta_seleccionada === 'e') {
          pesoRespuesta = pregunta.peso_e
        }

        // 2d) Cargamos examen para obtener más datos
        await pregunta.load('examen')
        const examenId = pregunta.examen_id
        const nombreExamen = pregunta.examen?.nombre
        const versionExamen = pregunta.examen?.version

        // 2e) Construimos payload final
        const payload = {
          candidato_id: candidatoId,
          pregunta_id: r.pregunta_id,
          respuesta_seleccionada: r.respuesta_seleccionada,
          intento_id: nuevoIntento,
          es_correcta: esCorrecta,
          peso_respuesta: pesoRespuesta,
          examen_id: examenId,
          nombre_examen: nombreExamen,
          version_examen: versionExamen,
          peso_pregunta: pregunta.peso_pregunta,
        }

        console.log('→ storeMasivo: payload final =', payload)

        // 2f) Insertamos en la tabla rrhh_respuestas
        await RrhhRespuesta.create(payload)
      }

      return response.json({
        status: 'success',
        message: 'Respuestas guardadas correctamente',
        intento: nuevoIntento, // Por si quieres notificar al front
      })
    } catch (error) {
      console.error('storeMasivo => ERROR', error)
      return response.status(500).json({
        status: 'error',
        message: error.message || 'Error guardando respuestas',
      })
    }
  }
}

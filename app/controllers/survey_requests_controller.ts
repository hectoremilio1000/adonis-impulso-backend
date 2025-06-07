// file: app/Controllers/Http/SurveyRequestsController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Survey from '#models/survey'
import SurveyQuestion from '#models/survey_question'
import SurveyRequest from '#models/survey_request'

/**
 * Maneja las solicitudes de encuestas (survey_requests).
 */
export default class SurveyRequestsController {
  /**
   * GET /api/survey-requests
   * Lista todas las solicitudes de encuesta.
   */
  public async index({}: HttpContext) {
    try {
      console.log('SurveyRequestsController.index => Buscando todas las survey_requests')
      const requests = await SurveyRequest.query()
        .preload('user')
        .preload('company') // <-- Aquí
        .orderBy('id', 'desc')

      console.log('SurveyRequestsController.index => requests.length:', requests.length)
      return requests
    } catch (error) {
      console.error('SurveyRequestsController.index => ERROR:', error)
      throw error
    }
  }

  /**
   * POST /api/survey-requests
   * Crea una nueva solicitud de encuesta.
   */
  public async store({ request, auth, response }: HttpContext) {
    console.log('SurveyRequestsController.store => Iniciando creación de SurveyRequest')

    if (!auth.user) {
      console.log('SurveyRequestsController.store => No hay usuario autenticado')
      return response.unauthorized({ message: 'No hay usuario autenticado' })
    }

    try {
      const data = request.only(['user_id', 'company_id', 'title', 'questions_json', 'notes'])

      console.log('SurveyRequestsController.store => data recibido:', data)

      // Convertimos el array/objeto a string para almacenarlo
      const questionsAsString = JSON.stringify(data.questions_json)
      console.log('SurveyRequestsController.store => questionsAsString:', questionsAsString)

      const newRequest = await SurveyRequest.create({
        user_id: data.user_id,
        title: data.title,
        company_id: data.company_id,
        questions_json: questionsAsString,
        notes: data.notes || null,
        status: 'pending',
      })

      console.log('SurveyRequestsController.store => SurveyRequest creado con ID:', newRequest.id)
      console.log('SurveyRequestsController.store => SurveyRequest.status:', newRequest.status)
      console.log(
        'SurveyRequestsController.store => SurveyRequest.questions_json:',
        newRequest.questions_json
      )

      return newRequest
    } catch (error) {
      console.error('SurveyRequestsController.store => ERROR:', error)
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * GET /api/survey-requests/:id
   */
  public async show({ params, response }: HttpContext) {
    console.log('SurveyRequestsController.show => Buscando SurveyRequest con ID:', params.id)

    const requestRecord = await SurveyRequest.query().where('id', params.id).preload('user').first()

    if (!requestRecord) {
      console.log('SurveyRequestsController.show => No encontrado')
      return response.notFound({ message: 'SurveyRequest not found' })
    }

    console.log('SurveyRequestsController.show => Encontrado:', requestRecord)
    return requestRecord
  }

  /**
   * PUT /api/survey-requests/:id
   */
  public async update({ params, request, response }: HttpContext) {
    console.log('SurveyRequestsController.update => ID:', params.id)

    const req = await SurveyRequest.find(params.id)
    if (!req) {
      console.log('SurveyRequestsController.update => No encontrado')
      return response.notFound({ message: 'SurveyRequest not found' })
    }

    const data = request.only(['title', 'questions_json', 'notes', 'status'])
    console.log('SurveyRequestsController.update => Data recibida:', data)

    try {
      // Si recibimos questions_json, parseamos y re-stringificamos
      if (data.questions_json) {
        data.questions_json = JSON.stringify(data.questions_json)
      }

      req.merge(data)
      await req.save()

      console.log('SurveyRequestsController.update => Actualizado OK. Nuevo status:', req.status)
      return req
    } catch (error) {
      console.error('SurveyRequestsController.update => ERROR:', error)
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * DELETE /api/survey-requests/:id
   */
  public async destroy({ params, response }: HttpContext) {
    console.log('SurveyRequestsController.destroy => ID:', params.id)

    const req = await SurveyRequest.find(params.id)
    if (!req) {
      console.log('SurveyRequestsController.destroy => No encontrado')
      return response.notFound({ message: 'SurveyRequest not found' })
    }

    await req.delete()
    console.log('SurveyRequestsController.destroy => Eliminado OK')
    return { message: 'SurveyRequest deleted' }
  }

  /**
   * POST /api/survey-requests/:id/approve
   * Crea la encuesta final (Survey + SurveyQuestions) a partir de la solicitud.
   */
  public async approve({ params, response }: HttpContext) {
    console.log('SurveyRequestsController.approve => Iniciando con ID:', params.id)

    try {
      // 1) Buscar la solicitud
      const requestRecord = await SurveyRequest.find(params.id)
      console.log('SurveyRequestsController.approve => requestRecord:', requestRecord)

      if (!requestRecord) {
        console.log('SurveyRequestsController.approve => No se encontró la solicitud')
        return response.notFound({ message: 'SurveyRequest not found' })
      }

      // 2) Crear el Survey
      const code = `SURVEY-${Date.now()}`
      console.log('SurveyRequestsController.approve => Generando code:', code)

      const newSurvey = await Survey.create({
        user_id: requestRecord.user_id,
        title: requestRecord.title,
        company_id: requestRecord.company_id,
        code,
        is_active: true,
        survey_request_id: requestRecord.id, // <-- Enlazamos la solicitud
      })
      console.log('SurveyRequestsController.approve => Survey creado con ID:', newSurvey.id)

      // 3) Obtener y parsear questions_json
      // OJO: Si la columna es JSON (o Adonis ya parsea), "requestRecord.questions_json" podría ser array/obj
      const raw = requestRecord.questions_json || []
      console.log('SurveyRequestsController.approve => raw questions_json:', raw)

      let questionsData: any[] = []

      if (Array.isArray(raw)) {
        // Si "raw" ya es un array, lo usamos tal cual
        questionsData = raw
      } else if (typeof raw === 'string') {
        // Si "raw" es string, hacemos parse
        try {
          questionsData = JSON.parse(raw)
        } catch (err) {
          console.error('SurveyRequestsController.approve => Error al hacer JSON.parse:', err)
          return response.badRequest({
            message: 'questions_json contiene un JSON inválido',
            error: err.message,
          })
        }
      } else {
        // Si por cualquier cosa viene nulo u objeto raro, dejamos un array vacío
        questionsData = []
      }

      console.log('SurveyRequestsController.approve => questionsData (parseado):', questionsData)

      // 4) Crear SurveyQuestions
      for (const [i, q] of questionsData.entries()) {
        console.log('SurveyRequestsController.approve => Creando pregunta #', i, 'con datos:', q)

        let opts = q.options_json
        if (Array.isArray(opts)) {
          // [ 'bueno', 'malo', 'regular' ] -> '["bueno","malo","regular"]'
          opts = JSON.stringify(opts)
        }

        // Y luego
        const createdQuestion = await SurveyQuestion.create({
          survey_id: newSurvey.id,
          question_text: q.question_text || 'Pregunta sin texto',
          type: q.type || 'text',
          options_json: opts,
          order_index: i,
        })

        console.log(
          'SurveyRequestsController.approve => Pregunta creada con ID:',
          createdQuestion.id
        )
      }

      // 5) Actualizar status a "approved"
      requestRecord.status = 'approved'
      await requestRecord.save()

      console.log(
        'SurveyRequestsController.approve => Solicitud aprobada. Survey ID:',
        newSurvey.id,
        'RequestRecord.status:',
        requestRecord.status
      )

      return {
        message: 'SurveyRequest approved, Survey created',
        survey_id: newSurvey.id,
        code,
      }
    } catch (error) {
      console.error('SurveyRequestsController.approve => ERROR:', error)
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * POST /api/survey-requests/:id/reject
   */
  public async reject({ params, response }: HttpContext) {
    console.log('SurveyRequestsController.reject => Rechazando ID:', params.id)

    const req = await SurveyRequest.find(params.id)
    if (!req) {
      console.log('SurveyRequestsController.reject => No encontrado')
      return response.notFound({ message: 'SurveyRequest not found' })
    }

    req.status = 'rejected'
    await req.save()

    console.log('SurveyRequestsController.reject => Rechazado OK. Nuevo status:', req.status)
    return { message: 'SurveyRequest rejected', request: req }
  }
}

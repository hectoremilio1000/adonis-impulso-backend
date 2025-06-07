// file: app/Controllers/Http/SurveysController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Survey from '#models/survey'
import SurveyQuestion from '#models/survey_question'

export default class SurveysController {
  /**
   * GET /api/surveys
   * Lista todas las encuestas (o filtra por user_id si se pasa en la query).
   */
  public async index({ request, response }: HttpContext) {
    try {
      console.log('SurveysController.index => Ingresó al método /api/surveys')

      const userId = request.input('user_id')
      console.log('SurveysController.index => userId recibido:', userId)

      let query = Survey.query()
        .preload('user')
        .preload('questions')
        .preload('company') // <--- Agregamos aquí
        .orderBy('id', 'desc')
      if (userId) {
        query = query.where('user_id', userId)
        console.log('SurveysController.index => Aplicando where user_id =', userId)
      }

      const surveys = await query
      console.log('SurveysController.index => encuestas totales:', surveys.length)
      surveys.forEach((s, idx) => {
        console.log(`Survey #${idx} => ID=${s.id}, title="${s.title}", user_id=${s.user_id}`)
      })

      return surveys
    } catch (err) {
      console.error('SurveysController.index => ERROR:', err)
      return response.status(500).json({ error: 'Error al obtener encuestas' })
    }
  }

  /**
   * GET /api/surveys/:id
   */
  public async show({ params, response }: HttpContext) {
    const survey = await Survey.query()
      .where('id', params.id)
      .preload('user')
      .preload('questions')
      .first()

    if (!survey) {
      return response.notFound({ message: 'Survey not found' })
    }
    return survey
  }

  /**
   * PUT /api/surveys/:id
   */
  public async update({ params, request, response }: HttpContext) {
    const survey = await Survey.find(params.id)
    if (!survey) {
      return response.notFound({ message: 'Survey not found' })
    }

    const data = request.only(['title', 'is_active'])
    survey.merge(data)
    await survey.save()

    // Manejo de preguntas:
    const questions = request.input('questions')
    if (questions) {
      // Eliminamos las anteriores preguntas de la encuesta
      await SurveyQuestion.query().where('survey_id', survey.id).delete()

      // Creamos nuevas preguntas
      for (const [i, q] of questions.entries()) {
        let opts = q.options_json
        // Si es array, lo convertimos a string JSON, si no existe lo ponemos null
        if (Array.isArray(opts)) {
          opts = JSON.stringify(opts)
        } else if (!opts) {
          opts = null
        }

        await SurveyQuestion.create({
          survey_id: survey.id,
          question_text: q.question_text || 'Pregunta sin texto',
          type: q.type || 'text',
          order_index: i,
          options_json: opts,
        })
      }
    }

    return survey
  }

  /**
   * DELETE /api/surveys/:id
   */
  public async destroy({ params, response }: HttpContext) {
    const survey = await Survey.find(params.id)
    if (!survey) {
      return response.notFound({ message: 'Survey not found' })
    }
    await survey.delete()
    return { message: 'Survey deleted' }
  }
}

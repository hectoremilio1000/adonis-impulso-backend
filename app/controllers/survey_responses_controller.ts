// file: app/Controllers/Http/SurveyResponsesController.ts
import type { HttpContext } from '@adonisjs/core/http'
import SurveyResponse from '#models/survey_response'

export default class SurveyResponsesController {
  public async index({ response }: HttpContext) {
    try {
      console.log('SurveyResponsesController.index => Entró a /api/survey-responses')

      const responses = await SurveyResponse.query().preload('answers')
      console.log('SurveyResponsesController.index => total responses:', responses.length)

      responses.forEach((r, idx) => {
        console.log(
          `Response #${idx} => ID=${r.id}, survey_id=${r.survey_id}, created_at=${r.createdAt}`
        )
      })

      return response.json(responses)
    } catch (err) {
      console.error('SurveyResponsesController.index => ERROR:', err)
      return response.status(500).json({ error: 'Error al obtener las responses' })
    }
  }
}

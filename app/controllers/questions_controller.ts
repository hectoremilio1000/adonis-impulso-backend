import Question from '#models/question'
import type { HttpContext } from '@adonisjs/core/http'

export default class QuestionsController {
  public async index({}: HttpContext) {
    try {
      const questions = await Question.query().preload('options')
      return {
        status: 'success',
        code: 200,
        message: 'Prospects fetched succesfully',
        data: questions,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching prospects',
        error: error.message,
      }
    }
  }
  public async questionsByContext({ params }: HttpContext) {
    try {
      const context = params.context
      const questions = await Question.query().preload('options').where('context', context)

      return {
        status: 'success',
        code: 200,
        message: 'Questions fetched succesfully',
        data: questions,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching Questions',
        error: error.message,
      }
    }
  }
}

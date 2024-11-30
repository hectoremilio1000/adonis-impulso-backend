// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
import OpenAI from 'openai'
import env from '#start/env'

export default class OpeanaichatsController {
  public async ask({ request, response }: HttpContext) {
    const { question } = request.only(['question'])
    if (!question) {
      return response.status(400).json({ error: 'Question is required' })
    }
    try {
      const openAiServive = new OpenAI({
        apiKey: env.get('OPENAI_API_KEY'),
      })
      const completion = await openAiServive.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      })

      const answer =
        completion.choices[0]?.message?.content || 'Sin respuesta contactar a Impulso Restaurantero'

      return response.status(200).json({ answer })
    } catch (error) {
      console.error('Error al conectarse con  openai:', error)
      return response.status(500).json({
        error: 'Failed to process the request',
        details: error.message,
      })
    }
  }
}

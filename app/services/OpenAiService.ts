import { Configuration, OpenAI } from 'openai'

export default class OpenAiService {
  private openai: OpenAI

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY, // Asegúrate de definir esta variable en .env
    })
    this.openai = new OpenAI(configuration)
  }

  public async askQuestion(question: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Modelo GPT que deseas usar
        messages: [{ role: 'user', content: question }],
      })

      // Retorna la respuesta de la API
      response({})
    } catch (error) {
      console.error('Error connecting to OpenAI:', error)
      throw new Error('Error connecting to OpenAI')
    }
  }
}

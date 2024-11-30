import type { HttpContext } from '@adonisjs/core/http'

import Prospect from '#models/prospect'
import app from '@adonisjs/core/services/app'
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'

export default class ProspectsController {
  public async index({}: HttpContext) {
    try {
      const prospects = await Prospect.all()
      return {
        status: 'success',
        code: 200,
        message: 'Prospects fetched succesfully',
        data: prospects,
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

  public async show({ params }: HttpContext) {
    try {
      const prospect = await Prospect.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Operation successful',
        data: prospect,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'An error occurred',
        error: error.message,
      }
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['first_name', 'last_name', 'email', 'whatsapp'])
      const prospect = await Prospect.create(data)
      const pdfPath = app.makePath('resources/static/33-casos-exitosos.pdf')

      await mail.send((message) => {
        message
          .to(data.email)
          .from(env.get('SMTP_USERNAME'))
          .subject('informacion casos exitosos')
          .text('información casos exitosos')
          .html('<h1>33 Casos Exitosos</h1><p>Adjunto encontrarás información valiosa.</p>')
          .attach(pdfPath, { filename: '33-Casos-Exitosos.pdf' })
      })

      return response.status(201).json({
        message: 'Prospect succesfully created and email sent',
        data: prospect,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'Error processing request' })
    }
  }
}

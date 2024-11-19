import type { HttpContext } from '@adonisjs/core/http'

import Prospect from '#models/prospect'

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

import Section from '#models/section'
import type { HttpContext } from '@adonisjs/core/http'

export default class SectionsController {
  async store({ request, auth }: HttpContext) {
    try {
      await auth.check()

      const data = request.only([
        'title',
        'active_title',
        'description',
        'active_description',
        'image',
        'active_image',
        'successcase_id',
      ])
      const sections = await Section.create(data)

      return {
        status: 'success',
        code: 201,
        message: 'Caso de estudio creado correctamente',
        data: sections,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creatin sections',
        error: error.message,
      }
    }
  }
}

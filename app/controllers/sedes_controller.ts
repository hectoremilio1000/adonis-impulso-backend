import type { HttpContext } from '@adonisjs/core/http'

import Sede from '#models/sede'

export default class SedesController {
  // Listar todos los sedes (GET /sedes)
  public async index({}: HttpContext) {
    try {
      const sedes = await Sede.query()

      return {
        status: 'success',
        code: 200,
        message: 'Modules fetched successfully',
        data: sedes,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching sedes',
        error: error.message,
      }
    }
  }

  // Mostrar un sede individual por ID (GET /sedes/:id)
  public async show({ params }: HttpContext) {
    console.log(params)
    const sede = await Sede.query().where('id', params.id).firstOrFail() // Cargar módulos relacionados
    return sede
  }

  // Crear un nuevo sede (POST /sedes)
  public async store({ request, auth }: HttpContext) {
    try {
      await auth.check()

      const data = request.only(['name', 'location', 'map_url', 'company_id']) // Asume que estos campos existen
      const userId = auth.user?.id

      // Crear el sede
      const sede = await Sede.create({
        name: data.name,
        location: data.location,
        map_url: data.map_url,
        company_id: data.company_id,
        created_by: userId,
      })

      return {
        status: 'success',
        code: 201,
        message: 'sede creado correctamente con módulos asociados',
        data: sede,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creating sede',
        error: error.message,
      }
    }
  }

  // Actualizar un sede existente (PUT /sedes/:id)
  public async update({ params, request }: HttpContext) {
    console.log(params)
    const sede = await Sede.findOrFail(params.id)
    const data = request.only(['name', 'location', 'map_url', 'company_id'])
    sede.merge(data)
    await sede.save()
    return sede
  }

  // Eliminar un sede (DELETE /sedes/:id)
  public async destroy({ params }: HttpContext) {
    const sede = await Sede.findOrFail(params.id)
    await sede.delete()
    return { message: 'sede deleted successfully' }
  }
}

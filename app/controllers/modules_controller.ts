import Module from '#models/module'
import type { HttpContext } from '@adonisjs/core/http'

export default class ModulesController {
  // Listar todos los modules (GET /modules)
  public async index({}: HttpContext) {
    try {
      const modules = await Module.all()
      return {
        status: 'success',
        code: 200,
        message: 'Modules fetched successfully',
        data: modules,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching modules',
        error: error.message,
      }
    }
  }

  // Mostrar un module individual por ID (GET /modules/:id)
  public async show({ params }: HttpContext) {
    try {
      const module = await Module.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Module fetched successfully',
        data: module,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 404,
        message: 'Module not found',
        error: error.message,
      }
    }
  }

  // Crear un nuevo module (POST /modules)
  public async store({ request, auth }: HttpContext) {
    try {
      const data = request.only(['name', 'description']) // Asume que estos campos existen
      await auth.check()
      // Obtener el ID del usuario autenticado desde `auth`

      const userId = auth.user?.id

      console.log(userId)

      // Crear el nuevo module con el `created_by` del usuario autenticado
      const module = await Module.create({
        ...data,
        active: true,
        created_by: userId, // Asignar el ID del usuario autenticado
      })

      return {
        status: 'success',
        code: 201,
        message: 'Module created successfully',
        data: module,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error creating module',
        error: error.message,
      }
    }
  }

  // Actualizar un module existente (PUT /modules/:id)
  public async update({ params, request }: HttpContext) {
    try {
      const module = await Module.findOrFail(params.id)
      const data = request.only(['name', 'description'])
      module.merge(data)
      await module.save()
      return {
        status: 'success',
        code: 201,
        message: 'Module update successfully',
        data: module,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error update module',
        error: error.message,
      }
    }
  }

  // Eliminar un module (DELETE /modules/:id)
  public async destroy({ params }: HttpContext) {
    const module = await Module.findOrFail(params.id)
    await module.delete()
    return { message: 'module deleted successfully' }
  }
}

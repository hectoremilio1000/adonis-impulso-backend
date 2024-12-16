import Plan from '#models/plan'
import PlansModule from '#models/plans_module'
import type { HttpContext } from '@adonisjs/core/http'

export default class PlansController {
  // Listar todos los planes (GET /plans)
  public async index({}: HttpContext) {
    try {
      const plans = await Plan.query().preload('modules')

      return {
        status: 'success',
        code: 200,
        message: 'Modules fetched successfully',
        data: plans,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching plans',
        error: error.message,
      }
    }
  }

  // Mostrar un plan individual por ID (GET /plans/:id)
  public async show({ params }: HttpContext) {
    console.log(params)
    const plan = await Plan.query().where('id', params.id).preload('modules').firstOrFail() // Cargar módulos relacionados
    return plan
  }

  // Crear un nuevo plan (POST /plans)
  public async store({ request, auth }: HttpContext) {
    try {
      await auth.check()

      const data = request.only(['name', 'price', 'description', 'modules']) // Asume que estos campos existen
      const userId = auth.user?.id

      // Crear el plan
      const plan = await Plan.create({
        name: data.name,
        price: data.price,
        description: data.description,
        created_by: userId,
        active: true,
      })

      // Asociar módulos al plan
      if (data.modules && Array.isArray(data.modules)) {
        const modules = data.modules.map((moduleId: number) => ({
          planId: plan.id,
          moduleId: moduleId,
          created_by: userId,
        }))
        await PlansModule.createMany(modules) // Guardar las asociaciones en la tabla intermedia
      }

      return {
        status: 'success',
        code: 201,
        message: 'Plan creado correctamente con módulos asociados',
        data: plan,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creating plan',
        error: error.message,
      }
    }
  }

  // Actualizar un plan existente (PUT /plans/:id)
  public async update({ params, request, auth }: HttpContext) {
    try {
      // Verificar autenticación
      await auth.check()
      const userId = auth.user?.id
      if (!userId) {
        return {
          status: 'error',
          code: 401,
          message: 'Usuario no autorizado',
        }
      }

      // Buscar el plan y obtener los datos del request
      const plan = await Plan.findOrFail(params.id)
      const data = request.only([
        'name',
        'price',
        'description',
        'active',
        'addModules',
        'removeModules',
      ])

      // Actualizar los datos del plan
      plan.merge({
        name: data.name,
        price: data.price,
        description: data.description,
        active: data.active,
      })
      await plan.save()

      // Manejar módulos a agregar
      if (data.addModules && data.addModules.length > 0) {
        const modulesToAdd = data.addModules.map((module: any) => ({
          plan_id: plan.id,
          module_id: module.id,
          created_by: userId,
        }))
        await PlansModule.createMany(modulesToAdd) // Crear asociaciones en la tabla intermedia
      }

      // Manejar módulos a eliminar
      if (data.removeModules && data.removeModules.length > 0) {
        const moduleIdsToRemove = data.removeModules.map((module: any) => module.id)
        await PlansModule.query()
          .where('plan_id', plan.id)
          .whereIn('module_id', moduleIdsToRemove)
          .delete() // Eliminar asociaciones en la tabla intermedia
      }

      // Devolver respuesta exitosa
      return {
        status: 'success',
        code: 200,
        message: 'Plan actualizado correctamente con módulos asociados',
        data: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          description: plan.description,
          active: plan.active,
          updatedAt: plan.updatedAt,
          addModules: data.addModules,
          removeModules: data.removeModules,
        },
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error al actualizar el plan',
        error: error.message,
      }
    }
  }

  // Eliminar un plan (DELETE /plans/:id)
  public async destroy({ params }: HttpContext) {
    const plan = await Plan.findOrFail(params.id)
    await plan.delete()
    return { message: 'Plan deleted successfully' }
  }
}

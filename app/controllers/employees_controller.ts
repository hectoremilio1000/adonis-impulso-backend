// app/Controllers/Http/EmployeesController.ts

import Company from '#models/company'
import Employee from '#models/employee'
import EmployeeLessonProgress from '#models/training_employee_lesson_progress'
import EmployeeModuleProgress from '#models/training_employee_module_progress'
import EmployeeTrainingPath from '#models/training_employee_path'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class EmployeesController {
  /**
   * GET /api/companies/:companyId/employees
   */
  public async index({ params, response }: HttpContext) {
    try {
      const { companyId } = params
      const employees = await Employee.query()
        .where('company_id', companyId)
        .preload('company')
        .preload('position')
        // Si deseas ver también la relación con position:
        // .preload('position')
        .orderBy('id', 'asc')

      return {
        status: 'success',
        data: employees,
      }
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        status: 'error',
        message: 'Error al listar empleados',
      })
    }
  }

  /**
   * GET /api/companies/:companyId/employees/:id
   */
  public async show({ params, response }: HttpContext) {
    try {
      const { companyId, id } = params
      const employee = await Employee.query()
        .where('company_id', companyId)
        .where('id', id)
        .preload('position') // si quieres cargar el puesto
        .firstOrFail()

      return {
        status: 'success',
        data: employee,
      }
    } catch (error) {
      console.error(error)
      return response.notFound({
        status: 'error',
        message: 'Empleado no encontrado',
      })
    }
  }

  /**
   * POST /api/companies/:companyId/employees
   */
  public async store({ auth, params, request, response }: HttpContext) {
    try {
      const { companyId } = params

      // Verificar que la compañía exista
      await Company.findOrFail(companyId)

      // Leer campos del body
      // Ajusta si tu front envía "positionId" en lugar de "position"
      const data = request.only(['name', 'email', 'phone', 'positionId', 'password'])

      // Creas un User (rol=4 => employee)
      const newUser = await User.create({
        name: data.name,
        email: data.email,
        password: data.password || '123456', // valor por defecto si no te lo envían
        rol_id: 4, // Ajusta al rol "employee" en tu BD
        isActive: true,
        created_by: auth.user?.id,
        whatsapp: data.phone,
      })

      // Crear Empleado
      const employee = await Employee.create({
        company_id: companyId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        positionId: data.positionId || null, // Asigna la clave foránea al puesto
        createdBy: auth.user?.id,
        userId: newUser.id, // Asocia al nuevo user
      })

      return {
        status: 'success',
        message: 'Empleado y usuario creados correctamente',
        data: { employee, user: newUser },
      }
    } catch (error) {
      console.error('[EmployeesController.store] Error =>', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error al crear empleado y su usuario',
      })
    }
  }

  /**
   * PUT /api/companies/:companyId/employees/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const { companyId, id } = params

      const employee = await Employee.query()
        .where('company_id', companyId)
        .where('id', id)
        .firstOrFail()

      // Ajusta si tu front envía "positionId" en lugar de "position"
      const data = request.only(['name', 'email', 'phone', 'positionId'])

      employee.merge(data)
      await employee.save()

      return {
        status: 'success',
        message: 'Empleado actualizado correctamente',
        data: employee,
      }
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        status: 'error',
        message: 'Error al actualizar empleado',
      })
    }
  }

  /**
   * DELETE /api/companies/:companyId/employees/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const { companyId, id } = params

      // 1) Buscamos el empleado
      const employee = await Employee.query()
        .where('company_id', companyId)
        .where('id', id)
        .firstOrFail()

      // 2) Guardar el userId
      const userId = employee.userId

      // 3) Eliminamos el empleado
      await employee.delete()

      // 4) Marcamos el user como inactivo
      if (userId) {
        const user = await User.find(userId)
        if (user) {
          user.isActive = false
          await user.save()
        }
      }

      return {
        status: 'success',
        message: 'Empleado eliminado y usuario desactivado correctamente',
      }
    } catch (error) {
      console.error(error)
      return response.notFound({
        status: 'error',
        message: 'No se pudo eliminar o no existe',
      })
    }
  }

  /**
   * GET /api/me/employee
   * Retorna el employee asociado al usuario actual.
   */
  public async myEmployee({ auth, response }: HttpContext) {
    try {
      // Tomar el usuario autenticado
      const user = auth.user
      if (!user) {
        return response.unauthorized({
          status: 'error',
          message: 'No se encontró un usuario autenticado.',
        })
      }

      // Buscar el registro Employee que tenga user_id = user.id
      const employee = await Employee.query()
        .where('user_id', user.id)
        .preload('company', (companyQuery) => {
          companyQuery.preload('admin') // <-- esto carga al usuario "dueño/admin" de la empresa
        })
        .preload('position') // ← Agregas este preload
        .first()

      if (!employee) {
        return response.notFound({
          status: 'error',
          message: 'No existe un Employee asociado a este usuario.',
        })
      }

      return {
        status: 'success',
        data: employee,
      }
    } catch (error) {
      console.error('[EmployeesController.myEmployee] Error =>', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los datos del empleado.',
      })
    }
  }

  /**
   * GET /api/companies/:id/training
   * Ejemplo de traer la info de capacitación
   */
  public async showTraining({ params, response }: HttpContext) {
    try {
      const employeeId = params.id

      // 1) Traer las rutas asignadas
      const assignedPaths = await EmployeeTrainingPath.query()
        .where('employee_id', employeeId)
        .preload('trainingPath', (tpQuery) => {
          tpQuery.preload('modules', (mQuery) => {
            mQuery.preload('lessons')
          })
        })

      // 2) Progreso a nivel module
      const allModulesProgress = await EmployeeModuleProgress.query().where(
        'employee_id',
        employeeId
      )

      // 3) Progreso a nivel lesson
      const allLessonsProgress = await EmployeeLessonProgress.query().where(
        'employee_id',
        employeeId
      )

      // Estructurar un json:
      const data = assignedPaths.map((ap) => {
        const tp = ap.trainingPath
        if (!tp) return ap

        const modulesWithProgress = tp.modules.map((mod) => {
          // buscar si hay un progress row
          const modProgress = allModulesProgress.find((mp) => mp.moduleId === mod.id)

          // para las lessons
          const lessonsDetail = mod.lessons.map((lesson) => {
            const viewed = allLessonsProgress.find((lp) => lp.lessonId === lesson.id)
            return {
              ...lesson.toJSON(),
              viewedAt: viewed?.viewedAt ?? null,
            }
          })

          return {
            ...mod.toJSON(),
            moduleProgress: modProgress ? modProgress.toJSON() : null,
            lessons: lessonsDetail,
          }
        })

        return {
          ...ap.toJSON(), // status = not_started/in_progress/completed
          trainingPath: {
            ...tp.toJSON(),
            modules: modulesWithProgress,
          },
        }
      })

      return response.json({
        status: 'success',
        data,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al obtener la capacitación del empleado',
      })
    }
  }

  public async getTrainingPaths({ params, response }: HttpContext) {
    try {
      const employeeId = params.id
      const records = await EmployeeTrainingPath.query()
        .where('employee_id', employeeId)
        .preload('trainingPath', (tpQuery) => {
          tpQuery.preload('modules')
        })
      return response.json({ status: 'success', data: records })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ status: 'error', message: 'Falló getTrainingPaths' })
    }
  }

  /**
   * GET /api/employees (sin companyId)
   */
  // app/Controllers/Http/EmployeesController.ts
  public async indexAll({ request, response }: HttpContext) {
    try {
      // 1) Leer query params. Agregamos opcionalmente "employeeId" y/o "employeeName"
      const { companyId, positionId, employeeId, employeeName } = request.qs()

      // 2) Construir el query base
      let query = Employee.query()
        .preload('company')
        .preload('position', (posQuery) => {
          posQuery.preload('manuals')
        })
        .orderBy('id', 'asc')

      // 3) Si mandaron companyId, filtrar
      if (companyId) {
        query = query.where('company_id', companyId)
      }

      // 4) Si mandaron positionId, filtrar
      if (positionId) {
        query = query.where('position_id', positionId)
      }

      // 5) (NUEVO) Si mandaron employeeId, filtrar por id exacto
      if (employeeId) {
        query = query.where('id', employeeId)
      }

      // 6) (OPCIONAL) Si quieres filtrar por nombre
      //    (usa whereILike para buscar coincidencias parciales)
      if (employeeName) {
        query = query.whereILike('name', `%${employeeName}%`)
      }

      // 7) Ejecutar query
      const employees = await query

      return {
        status: 'success',
        data: employees,
      }
    } catch (error) {
      console.error('[EmployeesController.indexAll] Error =>', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error al listar empleados (indexAll)',
        error: error.message,
      })
    }
  }
}

// app/Controllers/Http/EmployeeTrainingPathsController.ts

import EmployeeTrainingPath from '#models/training_employee_path'
import type { HttpContext } from '@adonisjs/core/http'

export default class EmployeeTrainingPathsController {
  /**
   * Asigna una ruta de capacitación a un empleado
   * Body params esperados: { employee_id, training_path_id }
   */
  public async assign({ request, response }: HttpContext) {
    try {
      const { employee_id, training_path_id } = request.only(['employee_id', 'training_path_id'])

      // Crea la relación con estado "not_started" por defecto
      const newRecord = await EmployeeTrainingPath.create({
        employeeId: employee_id,
        trainingPathId: training_path_id,
        status: 'not_started',
      })

      return response.json({
        status: 'success',
        message: 'Ruta asignada correctamente al empleado',
        data: newRecord,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo asignar la ruta',
      })
    }
  }

  /**
   * Ejemplo de listar todas las rutas asignadas a un empleado
   * GET /api/employees/:id/training-paths
   */
  public async listEmployeePaths({ params, response }: HttpContext) {
    try {
      const employeeId = params.id
      // Busca las relaciones y precarga la info de la ruta
      const records = await EmployeeTrainingPath.query()
        .where('employee_id', employeeId)
        .preload('trainingPath') // Si quieres también preload de modules, usar .preload('trainingPath', q => q.preload('modules'))

      return response.json({
        status: 'success',
        data: records,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo obtener las rutas del empleado',
      })
    }
  }

  public async updateStatus({ request, response }: HttpContext) {
    try {
      const { etp_id, newStatus } = request.only(['etp_id', 'newStatus'])
      // etp_id => ID del row de employee_training_paths
      // newStatus => "in_progress" | "completed" etc.

      const record = await EmployeeTrainingPath.findOrFail(etp_id)
      record.status = newStatus
      await record.save()

      return response.json({
        status: 'success',
        message: `Status actualizado a ${newStatus}`,
        data: record,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo actualizar el status',
      })
    }
  }
}

import CandidatoIdeal from '#models/rrhh_candidato_ideal'

import type { HttpContext } from '@adonisjs/core/http'

export default class CandidatoIdealController {
  // GET /api/candidatoIdeal/obtener?puesto=Mesero
  public async index({ request, response }: HttpContext) {
    try {
      const puesto = request.qs().puesto // query param ?puesto=Mesero
      if (!puesto) {
        return response.status(400).json({
          status: 'error',
          message: 'Falta el query param: puesto',
        })
      }

      // Buscamos un "ideal" con EXACTO el nombre del puesto
      const ideal = await CandidatoIdeal.query().where('puesto', puesto).first()
      if (!ideal) {
        return response.status(404).json({
          status: 'error',
          message: `No hay candidato ideal para el puesto: ${puesto}`,
        })
      }

      return {
        status: 'success',
        data: ideal,
      }
    } catch (error) {
      console.error('[CandidatoIdeal.obtener] error =>', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error interno al obtener CandidatoIdeal',
      })
    }
  }
}

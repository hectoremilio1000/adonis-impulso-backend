// file: app/Controllers/Http/AyudaIAController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Recommendation from '#models/recommendation'
import db from '@adonisjs/lucid/services/db'

export default class AyudaIAController {
  /**
   * Lista todos los "encuestados" (sea User o Prospect) que tengan al menos
   * una respuesta en `responses` o una recomendación en `recommendations`.
   */
  public async index({}: HttpContext) {
    try {
      // 1) PROSPECTS --------------------------------
      // Usa Prospect.query() y haz leftJoin con 'recommendations'.
      // Filtramos con whereExists para asegurar que tengan al menos 1 `response`.
      const queryProspects = await db
        .from('prospects')
        .select(
          'prospects.id as prospect_id',
          'prospects.first_name',
          'prospects.last_name',
          'prospects.email',
          'prospects.created_at',
          'recommendations.id as recommendation_id',
          'recommendations.created_at as recommendation_date'
        )
        .leftJoin('recommendations', 'prospects.id', 'recommendations.prospect_id')
        .whereExists((subQ) => {
          subQ
            .from('responses')
            .whereRaw('responses.prospect_id = prospects.id')
            .select('responses.id')
        })

      // Mapeamos cada prospect para la respuesta final
      const prospectsData = queryProspects.map((row) => ({
        type: 'prospect',
        id: row.prospect_id,
        name: `${row.first_name} ${row.last_name}`.trim(),
        email: row.email,
        completed_at: row.created_at,
        recommendation_id: row.recommendation_id,
        recommendation_date: row.recommendation_date,
      }))

      // 2) USERS ------------------------------------
      // Usa User.query() y haz leftJoin con 'recommendations'.
      // También filtramos con whereExists para verificar si hay `responses.user_id`.
      const queryUsers = await db
        .from('users')
        .select(
          'users.id as user_id',
          'users.name',
          'users.email',
          'users.created_at',
          'recommendations.id as recommendation_id',
          'recommendations.created_at as recommendation_date'
        )
        .leftJoin('recommendations', 'users.id', 'recommendations.user_id')
        .whereExists((subQ) => {
          subQ.from('responses').whereRaw('responses.user_id = users.id').select('responses.id')
        })

      // Mapeamos cada user para la respuesta final
      const usersData = queryUsers.map((row) => ({
        type: 'user',
        id: row.user_id,
        name: row.name,
        email: row.email,
        completed_at: row.created_at,
        recommendation_id: row.recommendation_id,
        recommendation_date: row.recommendation_date,
      }))

      // 3) Fusionamos prospects + users
      const allData = [...prospectsData, ...usersData]

      // Ordenamos por fecha de creación (descending)
      allData.sort((a, b) => {
        return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      })

      return {
        status: 'success',
        data: allData,
      }
    } catch (error) {
      console.error('Error AyudaIAController.index:', error)
      return {
        status: 'error',
        message: error.message,
      }
    }
  }

  /**
   * Muestra detalle de una recomendación (opcional).
   * Puedes usar en su lugar tu RecommendationsController.show
   */
  public async show({ params }: HttpContext) {
    try {
      // Buscamos la recomendación por ID y precargamos (preload) al prospect y/o user
      const recommendation = await Recommendation.query()
        .where('id', params.id)
        .preload('prospect') // Necesitas un belongsTo(…) en Recommendation
        .preload('user') // Igual, si configuras belongsTo(…) en Recommendation
        .first()

      if (!recommendation) {
        return {
          status: 'error',
          message: 'No se encontró la recomendación',
        }
      }

      return {
        status: 'success',
        data: recommendation,
      }
    } catch (error) {
      console.error('Error AyudaIAController.show:', error)
      return {
        status: 'error',
        message: error.message,
      }
    }
  }
}

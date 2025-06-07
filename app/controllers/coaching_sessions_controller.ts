// app/Controllers/Http/CoachingSessionsController.ts

import CoachingSession from '#models/coaching_session'
import Subscription from '#models/subscription'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class CoachingSessionsController {
  // GET /api/coaching-sessions?subscription_id=XX
  public async index({ request, response }: HttpContext) {
    try {
      const subId = request.qs().subscription_id
      if (!subId) {
        return response.badRequest({
          status: 'error',
          message: 'subscription_id is required',
        })
      }

      const sessions = await CoachingSession.query()
        .where('subscription_id', subId)
        .orderBy('session_date', 'desc')

      return {
        status: 'success',
        data: sessions,
      }
    } catch (err) {
      console.error(err)
      return response.internalServerError({
        status: 'error',
        message: 'Error listing coaching sessions',
      })
    }
  }

  // POST /api/coaching-sessions
  public async store({ request, response }: HttpContext) {
    try {
      const subscriptionId = request.input('subscription_id')
      const sessionDateStr = request.input('session_date') // "YYYY-MM-DD HH:mm:ss"
      const type = request.input('type') // 'presencial' | 'virtual'
      const hours = request.input('hours') // number

      // 1) Verificar la suscripción
      const sub = await Subscription.findOrFail(subscriptionId)
      await sub.load('plan') // para saber plan.name o plan.coaching_included

      // 2) Determinar límites mensuales (p.ej., Básico = 1+1, Pro = 1+3)
      let maxPresencial = 1
      let maxVirtual = 1
      if (sub.plan.name === 'Plan Pro') {
        maxPresencial = 1
        maxVirtual = 3
      }
      // Podrías manejar aquí lógica adicional (ej. 'trialing'), si lo deseas.

      // 3) Parsear la fecha de la sesión y calcular inicio/fin de mes
      const dateObj = DateTime.fromSQL(sessionDateStr)
      if (!dateObj.isValid) {
        return response.badRequest({
          message: 'Formato de fecha inválido (session_date)',
        })
      }
      const startOfMonth = dateObj.startOf('month') // p.ej. 2025-03-01 00:00
      const endOfMonth = dateObj.endOf('month') // p.ej. 2025-03-31 23:59

      // 4) Ver cuántas horas ya hay en este mes para esa suscripción
      const sessionsThisMonth = await CoachingSession.query()
        .where('subscription_id', subscriptionId)
        .whereBetween('session_date', [startOfMonth.toSQL(), endOfMonth.toSQL()])

      const usedPresencial = sessionsThisMonth
        .filter((s) => s.type === 'presencial')
        .reduce((acc, s) => acc + s.hours, 0)

      const usedVirtual = sessionsThisMonth
        .filter((s) => s.type === 'virtual')
        .reduce((acc, s) => acc + s.hours, 0)

      // 5) Validar que no se exceda el tope mensual según el tipo
      if (type === 'presencial') {
        if (usedPresencial + hours > maxPresencial) {
          return response.badRequest({
            message: `No puedes exceder ${maxPresencial} hora(s) presenciales en este mes.`,
          })
        }
      } else {
        // 'virtual'
        if (usedVirtual + hours > maxVirtual) {
          return response.badRequest({
            message: `No puedes exceder ${maxVirtual} hora(s) virtuales en este mes.`,
          })
        }
      }

      // 6) Crear la sesión
      const session = await CoachingSession.create({
        subscriptionId,
        sessionDate: dateObj, // se mapea a session_date en DB
        type,
        hours,
      })

      return {
        status: 'success',
        data: session,
      }
    } catch (err) {
      console.error(err)
      return response.internalServerError({
        status: 'error',
        message: 'Error creating session',
        error: err.message,
      })
    }
  }

  // GET /api/coaching-sessions/:id
  public async show({ params, response }: HttpContext) {
    try {
      const session = await CoachingSession.findOrFail(params.id)
      return {
        status: 'success',
        data: session,
      }
    } catch (err) {
      console.error(err)
      return response.notFound({
        status: 'error',
        message: 'Coaching session not found',
      })
    }
  }

  // PUT /api/coaching-sessions/:id
  public async update({ params, request, response }: HttpContext) {
    try {
      const session = await CoachingSession.findOrFail(params.id)
      // Leer campos actualizables
      const sessionDate = request.input('session_date')
      const type = request.input('type')
      const hours = request.input('hours')

      // Si quisieras volver a checar límite, tendrías que replicar la validación del store.
      // Aquí, por simplicidad, solo actualizamos sin revalidar el total.
      session.merge({
        sessionDate,
        type,
        hours,
      })
      await session.save()

      return {
        status: 'success',
        message: 'Coaching session updated',
        data: session,
      }
    } catch (err) {
      console.error(err)
      return response.internalServerError({
        status: 'error',
        message: 'Error updating session',
      })
    }
  }

  // DELETE /api/coaching-sessions/:id
  public async destroy({ params, response }: HttpContext) {
    try {
      const session = await CoachingSession.findOrFail(params.id)
      await session.delete()

      return {
        status: 'success',
        message: 'Coaching session deleted',
      }
    } catch (err) {
      console.error(err)
      return response.notFound({
        status: 'error',
        message: 'Session not found',
      })
    }
  }
}

import Subscription from '#models/subscription'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Plan from '#models/plan'
import Module from '#models/module'
import PlanChange from '#models/plan_change' // <--- Importa tu modelo PlanChange

export default class SubscriptionsController {
  // GET /api/subscriptions
  public async index({}: HttpContext) {
    try {
      const subscriptions = await Subscription.query()
        .preload('user', (userQuery) => {
          userQuery.select(['id', 'name', 'email'])
        })
        .preload('plan', (planQuery) => {
          planQuery.select(['id', 'name', 'description', 'price'])
        })

      return {
        status: 'success',
        code: 200,
        message: 'Suscripciones con user y plan preloaded',
        data: subscriptions,
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching subscriptions',
        error: error.message,
      }
    }
  }

  // GET /api/subscriptions/:id
  public async show({ params }: HttpContext) {
    try {
      const subscription = await Subscription.query().where('id', params.id).firstOrFail()
      return subscription
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // GET /api/subscriptionbyuser/:id
  public async subscriptionbyuser({ params }: HttpContext) {
    try {
      const subscription = await Subscription.query()
        .where('user_id', params.id)
        .preload('modules')
        .preload('plan', (planQuery) => {
          planQuery.preload('modules')
        })
        .firstOrFail()

      return {
        status: 'success',
        code: 200,
        message: 'Subscription fetched successfully',
        data: subscription,
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching subscription for user',
        error: error.message,
      }
    }
  }

  // POST /api/subscriptions
  public async store({ request, auth }: HttpContext) {
    const data = request.only(['user_id', 'plan_id', 'modules_ids'])
    const userId = auth.user?.id
    const now = DateTime.now()

    // 1. Buscar el plan
    const plan = await Plan.findOrFail(data.plan_id)

    // 2. Determinar horas de coaching
    let coachingIncluded = 0
    if (plan.name === 'Basico') {
      coachingIncluded = 2
    } else if (plan.name === 'Pro') {
      coachingIncluded = 4
    }
    // (o usar plan.coachingIncluded si ya lo tienes en DB)

    // 3. Duración trial (ej. 15 días)
    const trialDays = 15
    const endDate = now.plus({ days: trialDays }).toFormat('yyyy-MM-dd HH:mm:ss')

    // 4. Crear suscripción
    const subscription = await Subscription.create({
      user_id: data.user_id,
      plan_id: data.plan_id,
      start_date: now.toFormat('yyyy-MM-dd HH:mm:ss'),
      status: 'trialing',
      trialEndsAt: now.plus({ days: trialDays }),
      end_date: endDate,
      created_by: userId,
      coachingIncluded,
      coachingUsed: 0,
    })

    // 5. Asignar módulos
    if (data.modules_ids?.length > 0) {
      await subscription.related('modules').attach(data.modules_ids)
    } else {
      // Asocia todos los 'active'
      const allMods = await Module.query().where('active', true)
      const allIds = allMods.map((m) => m.id)
      await subscription.related('modules').attach(allIds)
    }

    return {
      status: 'success',
      message: 'Suscripción creada',
      data: subscription,
    }
  }

  // PUT /api/subscriptions/:id
  public async update({ params, request, response }: HttpContext) {
    try {
      const subscription = await Subscription.findOrFail(params.id)

      const { plan_id, modules_ids, coaching_included, coaching_used, status } = request.only([
        'plan_id',
        'modules_ids',
        'coaching_included',
        'coaching_used',
        'status',
        'end_date',
      ])

      // Detectar cambio de plan
      if (plan_id !== undefined && plan_id !== subscription.plan_id) {
        const oldPlan = await Plan.find(subscription.plan_id)
        const newPlan = await Plan.findOrFail(plan_id)

        // Registrar en plan_changes
        await PlanChange.create({
          subscriptionId: subscription.id,
          oldPlanId: oldPlan ? oldPlan.id : null,
          newPlanId: newPlan.id,
          changedAt: DateTime.now(),
          userId: subscription.user_id, // o auth.user?.id
        })

        // Cambiar plan
        subscription.plan_id = plan_id

        // Prorrateo si sube de horas
        if (oldPlan && newPlan.coachingIncluded > oldPlan.coachingIncluded) {
          const extra = newPlan.coachingIncluded - oldPlan.coachingIncluded
          const today = DateTime.local()
          const daysInMonth = today.daysInMonth
          const dayNumber = today.day
          const remainingDays = daysInMonth - dayNumber + 1
          const ratio = remainingDays / daysInMonth
          const hoursExtraProrrateadas = Math.ceil(extra * ratio)

          subscription.coachingIncluded += hoursExtraProrrateadas

          console.log(
            `[PlanChange] Sub ID=${subscription.id} => +${hoursExtraProrrateadas} horas prorrateadas`
          )
        } else {
          // si no sube, reasignar coachingIncluded
          subscription.coachingIncluded = newPlan.coachingIncluded
        }
      }

      // Actualizar otros campos
      if (coaching_included !== undefined) {
        subscription.coachingIncluded = coaching_included
      }
      if (coaching_used !== undefined) {
        subscription.coachingUsed = coaching_used
      }
      if (status !== undefined) {
        subscription.status = status
      }
      if (request.input('end_date') !== undefined) {
        subscription.end_date = request.input('end_date')
      }

      await subscription.save()

      // Manejo de módulos
      if (Array.isArray(modules_ids)) {
        await subscription.load('plan')
        const plan = subscription.plan
        if (plan && plan.max_modules !== null && plan.max_modules !== undefined) {
          if (modules_ids.length > plan.max_modules) {
            return response.status(400).json({
              status: 'error',
              message: `No puedes asignar más de ${plan.max_modules} módulos para este plan`,
            })
          }
        }
        await subscription.related('modules').sync(modules_ids)
        await subscription.load('modules')
      }

      return {
        status: 'success',
        message: 'Suscripción actualizada con prorrateo e historial',
        data: subscription,
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo actualizar la suscripción (con prorrateo)',
        error: error.message,
      })
    }
  }

  // DELETE /api/subscriptions/:id
  public async destroy({ params }: HttpContext) {
    const subscription = await Subscription.findOrFail(params.id)
    await subscription.delete()
    return { message: 'subscription deleted successfully' }
  }

  // PUT /api/subscriptions/:id/consume
  public async consumeCoaching({ params, request }: HttpContext) {
    const { hours } = request.only(['hours'])
    const subscription = await Subscription.findOrFail(params.id)

    subscription.coachingUsed += hours
    if (subscription.coachingUsed > subscription.coachingIncluded) {
      // warning
    }

    await subscription.save()

    return {
      status: 'success',
      data: subscription,
    }
  }

  // GET /api/subscriptions/:id/plan-changes
  public async planChanges({ params, response }: HttpContext) {
    try {
      const subscriptionId = params.id
      const changes = await PlanChange.query()
        .where('subscription_id', subscriptionId)
        .preload('oldPlan')
        .preload('newPlan')
        .orderBy('changed_at', 'desc')

      return response.json({
        status: 'success',
        data: changes,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'Error fetching plan changes',
        error: error.message,
      })
    }
  }
}

// app/jobs/ResetCoachingJob.ts
import Subscription from '#models/subscription'

import { BaseJob } from '../types/job.js'

export default class ResetCoachingJob extends BaseJob {
  public async handle() {
    console.log('[ResetCoachingJob] running...')
    // filtrar por suscripciones activas
    const subs = await Subscription.query().whereIn('status', ['active'])

    for (const s of subs) {
      // cargar plan
      await s.load('plan')
      const plan = s.plan
      if (!plan) continue

      // Reiniciar "coachingIncluded" y "coachingUsed"
      s.coachingUsed = 0
      s.coachingIncluded = plan.coachingIncluded
      await s.save()
    }
    console.log(`[ResetCoachingJob] Reseteado coaching de ${subs.length} suscripciones`)
  }
}

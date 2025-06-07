import Subscription from '#models/subscription'
import { DateTime } from 'luxon'
import { BaseJob } from '../types/job.js'

export default class CheckTrialsJob extends BaseJob {
  public async handle() {
    console.log('[CheckTrialsJob] running...')
    const now = DateTime.now()
    const trialSubs = await Subscription.query().where('status', 'trialing')

    for (const sub of trialSubs) {
      if (!sub.trialEndsAt) continue

      // If your subscription model uses `@column.dateTime`, you'd do:
      const trialEnd = DateTime.fromJSDate(sub.trialEndsAt.toJSDate?.() || new Date())

      const graceLimit = trialEnd.plus({ days: 5 })
      if (now > graceLimit) {
        sub.status = 'suspended'
        await sub.save()
        console.log(`Subscription ${sub.id} suspended for trial expiry`)
      }
    }
  }
}

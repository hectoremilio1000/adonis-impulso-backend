// app/jobs/ResetLoyaltyCountersJob.ts

import LoyaltyCard from '#models/loyalty_card'
import { BaseJob } from '../types/job.js'

export default class ResetLoyaltyCountersJob extends BaseJob {
  /**
   * This method must be called `handle()`,
   * because BaseJob defines `abstract handle()`
   */
  public async handle() {
    console.log('[ResetLoyaltyCountersJob] running...')

    // If you only want to reset active cards:
    await LoyaltyCard.query().where('is_active', true).update({
      visits_count: 0,
      products_count: 0,
    })

    console.log('[ResetLoyaltyCountersJob] all active cards have been reset')
  }
}

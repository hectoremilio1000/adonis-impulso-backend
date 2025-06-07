import SchedulerService from '#services/scheduler_service'
import HelloJob from '../app/jobs/hello_job.js'

import ResetLoyaltyCountersJob from '../app/jobs/reset_loyalty_counters_job.js'

// Create an instance of the scheduler service on server startup
const scheduler = new SchedulerService()

scheduler.addJob({
  key: 'reset-loyalty-counters', // un identificador único
  cronExpression: '0 0 1 * *', // 1er día de cada mes a medianoche
  job: new ResetLoyaltyCountersJob(),
})

// Add all jobs which should be run while the server is up
scheduler.addJob({
  key: 'hello-job',
  cronExpression: '* * * * *',
  job: new HelloJob(),
})

// Actually start a scheduler for all jobs
scheduler.scheduleAllJobs()

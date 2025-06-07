export abstract class BaseJob {
  abstract handle(): Promise<void>
}

export interface JobConfig {
  key: string
  cronExpression: string
  job: BaseJob
}

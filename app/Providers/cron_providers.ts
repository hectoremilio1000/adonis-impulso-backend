import { ApplicationService } from '@adonisjs/core/types'
import cron from 'node-cron'
import { DateTime } from 'luxon'
import Subscription from '#models/subscription'

export default class CronProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    // Registrar bindings, si hace falta
  }

  public async boot() {
    // Se ejecuta durante el boot de la aplicación
    this.startCronJobs()
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }

  /**
   * Define y arranca tus CRONs
   */
  private startCronJobs() {
    // 1) CRON para revisar trial + periodo de gracia
    cron.schedule('0 1 * * *', async () => {
      await this.checkTrials()
    })

    // 2) CRON para resetear horas de coaching (p.ej. día 1 del mes a las 00:05)
    cron.schedule('5 0 1 * *', async () => {
      await this.resetCoachingHours()
    })
  }

  /**
   * Verifica suscripciones en estado 'trialing' y las suspende
   * si han superado el periodo de prueba + gracia (5 días).
   */
  private async checkTrials() {
    console.log('checkTrials CRON running...')

    const now = DateTime.now()
    const trialSubs = await Subscription.query().where('status', 'trialing')

    for (const sub of trialSubs) {
      if (sub.trialEndsAt) {
        // trialEndsAt es un objeto DateTime
        const graceLimit = sub.trialEndsAt.plus({ days: 5 })

        if (now > graceLimit) {
          sub.status = 'suspended'
          await sub.save()
          console.log(`Subscription ${sub.id} suspended for trial expiry`)
        }
      }
    }
  }

  /**
   * Resetea el coachingUsed a 0 para todas las suscripciones
   * que estén 'active' o 'trialing', p.ej el día 1 de cada mes.
   */
  private async resetCoachingHours() {
    console.log('resetCoachingHours CRON running...')

    const subs = await Subscription.query().whereIn('status', ['active', 'trialing'])
    for (const sub of subs) {
      sub.coachingUsed = 0
      await sub.save()
    }

    console.log(`Reset coaching hours for ${subs.length} subscriptions`)
  }
}

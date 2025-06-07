// commands/Scheduler.ts

import { BaseCommand } from '@adonisjs/core/ace'
import cron from 'node-cron'

export default class Scheduler extends BaseCommand {
  public static commandName = 'scheduler'
  public static description = 'Ejecuta las tareas programadas'

  public async run() {
    this.logger.info('Scheduler iniciado.')

    // Programa una tarea para que se ejecute cada 10 segundos
    cron.schedule('*/10 * * * * *', () => {
      this.logger.info('¡Hola! Esto se ejecuta cada 10 segundos.')
    })

    // Para mantener el proceso en ejecución indefinidamente
    await new Promise(() => {})
  }
}

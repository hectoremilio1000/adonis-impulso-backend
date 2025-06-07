import cron from 'node-cron'

console.log('[TestCron] Iniciando scheduler de prueba...')

cron.schedule('*/10 * * * * *', () => {
  console.log('[TestCron] ¡Hola! Se ejecuta cada 10 segundos.')
})

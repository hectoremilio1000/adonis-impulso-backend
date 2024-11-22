import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: 'mail.impulsorestaurantero.com', // Servidor SMTP
      port: 465, // Puerto seguro para SMTP
      secure: true, // Requiere conexión segura
      auth: {
        type: 'login',
        user: 'clientes@impulsorestaurantero.com', // Tu usuario SMTP
        pass: '01Hv1930#', // Contraseña de tu cuenta SMTP
      },
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}

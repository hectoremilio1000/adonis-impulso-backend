import { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class TestMailController {
  public async sendTestEmail({ request, response }: HttpContext) {
    try {
      // Datos opcionales para personalizar el correo

      // Envío del correo
      await mail.send((message) => {
        message
          .from('clientes@impulsorestaurantero.com') // Dirección del remitente
          .to('hectoremilio1000@gmail.com') // Dirección del destinatario
          .subject('Correo de Prueba') // Asunto del correo
      })

      // Respuesta exitosa
      return response.status(201).json({
        status: 'success',
        code: 201,
        message: 'Correo enviado correctamente',
      })
    } catch (error) {
      console.error('Error al enviar correo:', error)

      // Manejo de errores
      return response.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error al enviar correo',
        error: error.message,
      })
    }
  }
}

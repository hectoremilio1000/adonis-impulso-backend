import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import { google } from 'googleapis'
import { GoogleAdsApi } from 'google-ads-api'
import { randomBytes } from 'crypto'

export default class TestGoogleAdsController {
  /**
   * Redirige al usuario a la página de autorización de Google Ads.
   */
  async index({ session, response }: HttpContext) {
    const oauth2Client = new google.auth.OAuth2(
      env.get('CLIENT_ID'),
      env.get('CLIENT_SECRET'),
      env.get('REDIRECT_URL') // URI de redirección
    )

    try {
      // Define los scopes necesarios para Google Ads
      const scopes = ['https://www.googleapis.com/auth/adwords']
      // Genera un valor único para la prevención de ataques CSRF
      const passthroughVal = randomBytes(32).toString('hex')

      // Guarda el valor en la sesión para validación posterior
      session.put('state', passthroughVal)

      // Genera la URL de autorización
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true,
        state: passthroughVal,
        prompt: 'consent', // Asegura que siempre se solicite un refresh_token
      })
      console.log(authUrl)

      // Redirige al usuario a la URL de autorización
      response.redirect(authUrl)
    } catch (error) {
      console.error('Error generando la URL de autorización:', error.message)
      return response.status(500).send({
        status: 'error',
        code: 500,
        message: 'Error al generar la URL de autorización.',
        error: error.message,
      })
    }
  }

  /**
   * Maneja el callback de Google OAuth2.
   */
  async oauth2callback({ request, session, response }: HttpContext) {
    try {
      const { state, code } = request.qs()

      // Verifica que el estado coincida con el almacenado en la sesión
      const storedState = session.get('state')
      console.log(storedState)
      if (!storedState || storedState !== state) {
        return response.status(400).send('Estado no válido o sesión expirada.')
      }

      // Crea un cliente OAuth2 para intercambiar el código por tokens
      const oauth2Client = new google.auth.OAuth2(
        env.get('CLIENT_ID'),
        env.get('CLIENT_SECRET'),
        env.get('REDIRECT_URL')
      )

      // Intercambia el código por tokens
      const { tokens } = await oauth2Client.getToken(code)
      console.log('Tokens obtenidos:', tokens)
      session.put('google_ads_token', tokens)

      oauth2Client.setCredentials(tokens)
      // Redirige a una página de éxito (puedes cambiar la URL según tu app)
      response.redirect(env.get('REDIRECT_URL_FRONT'))
    } catch (error) {
      console.error('Error durante el intercambio de tokens:', error.message)
      return response.status(500).send({
        status: 'error',
        code: 500,
        message: 'Error al manejar el callback de OAuth2.',
        error: error.message,
      })
    }
  }
  async getAccounts({ session, response }: HttpContext) {
    const tokens = session.get('google_ads_token')
    console.log('Tokens session guardada')
    console.log(tokens)
    if (!tokens) {
      return response.unauthorized({ message: 'Token no encontrado. Inicia sesión primero.' })
    }
    if (!tokens.refresh_token) {
      return response.unauthorized({ message: 'Genera un nuevo token de actualización' })
    }
    const client = new GoogleAdsApi({
      client_id: env.get('CLIENT_ID'),
      client_secret: env.get('CLIENT_SECRET'),
      developer_token: env.get('DEVELOPER_TOKEN'),
    })

    try {
      const customer = client.Customer({
        customer_id: env.get('CUSTOMER_ID'), // ID del cliente raíz (manager)
        refresh_token: tokens.refresh_token,
      })

      // Consulta SQL para obtener información de la cuenta
      const query = `
            SELECT customer_client.descriptive_name, customer_client.status, customer_client.currency_code, customer_client.time_zone, customer_client.level, customer_client.manager, customer_client.id, customer_client.hidden FROM customer_client
          `
      const responses = await customer.query(query)

      return response.ok(responses)
    } catch (error) {
      console.error('Error al obtener cuentas:', error)
      return response.internalServerError({ message: 'No se pudieron obtener las cuentas.' })
    }
  }
  async getCampaigns({ params, session, response }: HttpContext) {
    const tokens = session.get('google_ads_token')
    console.log(tokens)

    if (!tokens) {
      return response.unauthorized({ message: 'Token no encontrado. Inicia sesión primero.' })
    }

    const { accountId } = params

    const client = new GoogleAdsApi({
      client_id: env.get('CLIENT_ID'),
      client_secret: env.get('CLIENT_SECRET'),
      developer_token: env.get('DEVELOPER_TOKEN'),
    })

    // Crear instancia del cliente para la cuenta específica
    const customer = client.Customer({
      refresh_token: tokens.refresh_token,
      customer_id: accountId, // ID de la cuenta específica
      login_customer_id: env.get('CUSTOMER_ID'), // ID de tu cuenta MCC
    })

    try {
      // Ejecutar consulta para obtener campañas
      const query = `
        SELECT metrics.all_conversions, metrics.active_view_impressions, metrics.active_view_cpm, campaign.end_date, campaign.start_date, campaign.id, campaign.resource_name, campaign.name, metrics.average_cpc FROM campaign LIMIT 50
      `

      const campaigns = await customer.query(query)
      console.log('Campañas obtenidas:', campaigns)
      return response.ok(campaigns)
    } catch (error) {
      console.error('Error al obtener campañas:', error)

      // Manejo más detallado del error
      if (error.errors) {
        const apiErrors = error.errors.map((err: any) => ({
          message: err.message,
          details: err.error_code,
        }))
        return response.internalServerError({ message: 'Error de API', errors: apiErrors })
      }

      return response.internalServerError({ message: 'No se pudieron obtener las campañas.' })
    }
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import env from '#start/env'
import UserCalendly from '#models/user_calendly'
import { randomBytes } from 'crypto'

export default class AuthCalendliesController {
  async status({ auth, response, request }: HttpContext) {
    await auth.check()
    try {
      const user = auth.user!
      const { companyId } = request.qs()

      // Verificar si el usuario tiene un token de Calendly
      const calendlyUser = await UserCalendly.query()
        .where('user_id', user.id)
        .andWhere('company_id', companyId)
        .first()

      if (calendlyUser) {
        return response.json({
          isAuthenticated: true,
          calendlyUser,
        })
      } else {
        return response.json({
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('Error verificando estado de Calendly:', error.message)
      return response.status(500).json({
        status: 'error',
        message: 'Error verificando autenticación con Calendly',
        error: error.message,
      })
    }
  }
  async redirectToCalendly({ session, request, response }: HttpContext) {
    const redirectUri = env.get('CALENDLY_REDIRECT_URI')
    const clientId = env.get('CALENDLY_CLIENT_ID')
    const userId = request.qs().userId
    const companyId = request.qs().companyId
    const redirect = request.qs().redirect
    session.put('userId', userId)
    session.put('companyId', companyId)
    session.put('redirect', redirect)
    const passthroughVal = randomBytes(32).toString('hex')

    // Guarda el valor en la sesión para validación posterior
    session.put('state', passthroughVal)

    // URL DE AUTHORIZACION
    const authorizationUrl = `${env.get('CALENDLY_AUTH_BASE_URL')}/oauth/authorize`
    console.log(redirect, userId)

    const url = `${authorizationUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${passthroughVal}`
    return response.redirect(url)
  }

  async handleCallback({ session, request, response }: HttpContext) {
    try {
      const { code, state } = request.qs() // Recupera el parámetro `state`

      // Verifica que el estado coincida con el almacenado en la sesión
      const storedState = session.get('state')
      console.log('state stored')
      console.log(session.get('companyId'))

      if (!storedState || storedState !== state) {
        return response.status(400).send('Estado no válido o sesión expirada.')
      }
      const tokenUrl = `${env.get('CALENDLY_AUTH_BASE_URL')}/oauth/token`

      const { data } = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: env.get('CALENDLY_CLIENT_ID'),
          client_secret: env.get('CALENDLY_CLIENT_SECRET'),
          redirect_uri: env.get('CALENDLY_REDIRECT_URI'),
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      const { access_token, refresh_token } = data

      const userInfo = await axios.get(`${env.get('CALENDLY_API_BASE_URL')}/users/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })

      const veryUser = await UserCalendly.query()
        .where('calendly_uid', userInfo.data.resource.uri)
        .first()

      if (!veryUser) {
        await UserCalendly.create({
          calendly_uid: userInfo.data.resource.uri,
          access_token,
          refresh_token,
          user_id: session.get('userId'),
          company_id: session.get('companyId'),
        })
      }

      // Redirige al estado original (la URL dinámica)
      return response.redirect(session.get('redirect') || 'http://localhost:3000/manage')
    } catch (error) {
      console.error('Error al obtener el token:', error.message)
      return response.status(500).send('Error en la autenticación')
    }
  }
}

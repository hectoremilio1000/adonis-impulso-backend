import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import env from '#start/env'
import UserCalendly from '#models/user_calendly'

export default class AuthCalendliesController {
  async status({ auth, response }: HttpContext) {
    await auth.check()
    try {
      const user = auth.user!
      console.log(user.id)

      // Verificar si el usuario tiene un token de Calendly
      const calendlyUser = await UserCalendly.query().where('user_id', user.id).first()

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
  async redirectToCalendly({ request, response }: HttpContext) {
    const redirectUri = env.get('CALENDLY_REDIRECT_URI')
    const clientId = env.get('CALENDLY_CLIENT_ID')
    const userId = request.qs().userId
    const redirect = request.qs().redirect
    const authorizationUrl = `${env.get('CALENDLY_AUTH_BASE_URL')}/oauth/authorize`
    console.log(redirect, userId)

    const url = `${authorizationUrl}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&redirect=${redirect}&userId=${userId}`
    return response.redirect(url)
  }

  async handleCallback({ request, response }: HttpContext) {
    const { code, redirect, userId } = request.qs() // Recupera el parámetro `state`
    console.log(redirect, userId)
    try {
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
          user_id: userId,
        })
      }

      // Redirige al estado original (la URL dinámica)
      return response.redirect(redirect || 'http://localhost:3000/manage')
    } catch (error) {
      console.error('Error al obtener el token:', error.message)
      return response.status(500).send('Error en la autenticación')
    }
  }
}

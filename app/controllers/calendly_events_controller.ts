import UsersCalendly from '#models/user_calendly'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class CalendlyEventsController {
  async index({ request, response, auth }: HttpContext) {
    try {
      await auth.check()
      const { companyId } = request.qs()
      const user = auth.user!

      // Obtener datos del usuario relacionados con Calendly
      const userData = await UsersCalendly.query()
        .where('user_id', user.id)
        .andWhere('company_id', companyId)
        .first()

      if (!userData) {
        return response.status(404).json({
          status: 'error',
          message: 'Usuario no tiene tokens asociados a Calendly.',
        })
      }

      let { access_token, refresh_token, calendly_uid } = userData

      // Verificar si el token es válido
      try {
        // Hacer una solicitud de prueba para verificar el token
        await axios.get(`${env.get('CALENDLY_API_BASE_URL')}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expirado o inválido, intentar refrescar
          console.log('Token expirado, intentando refrescar...')
          const refreshedTokens = await this.refreshAccessToken(refresh_token)
          if (refreshedTokens) {
            access_token = refreshedTokens.access_token
            refresh_token = refreshedTokens.refresh_token

            // Guardar los nuevos tokens en la base de datos
            userData.merge({
              access_token,
              refresh_token,
            })
            await userData.save()
          } else {
            return response.status(401).json({
              status: 'error',
              message: 'No fue posible refrescar el token.',
            })
          }
        } else {
          throw error
        }
      }

      // Realizar la solicitud para obtener los tipos de eventos
      const { count = 10, page_token } = request.qs()
      let queryParams = [`count=${count}`]

      if (page_token) queryParams.push(`page_token=${page_token}`)
      if (calendly_uid) queryParams.push(`user=${calendly_uid}`)

      const url = `${env.get('CALENDLY_API_BASE_URL')}/event_types?${queryParams.join('&')}`

      const calendlyResponse = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })

      return response.json({
        status: 'success',
        data: calendlyResponse.data.collection,
      })
    } catch (error) {
      console.error('Error en CalendlyEventsController index:', error.message)

      return response.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al obtener los tipos de eventos.',
        error: error.message,
      })
    }
  }
  async eventTypeByUuid({ params, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!
      const uuid = params.uuid

      console.log(uuid)

      // Obtener datos del usuario relacionados con Calendly
      const userData = await UsersCalendly.findBy('user_id', user.id)

      if (!userData) {
        return response.status(404).json({
          status: 'error',
          message: 'Usuario no tiene tokens asociados a Calendly.',
        })
      }

      let { access_token, refresh_token } = userData

      // Verificar si el token es válido
      try {
        // Hacer una solicitud de prueba para verificar el token
        await axios.get(`${env.get('CALENDLY_API_BASE_URL')}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expirado o inválido, intentar refrescar
          console.log('Token expirado, intentando refrescar...')
          const refreshedTokens = await this.refreshAccessToken(refresh_token)
          if (refreshedTokens) {
            access_token = refreshedTokens.access_token
            refresh_token = refreshedTokens.refresh_token

            // Guardar los nuevos tokens en la base de datos
            userData.merge({
              access_token,
              refresh_token,
            })
            await userData.save()
          } else {
            return response.status(401).json({
              status: 'error',
              message: 'No fue posible refrescar el token.',
            })
          }
        } else {
          throw error
        }
      }

      // Realizar la solicitud para obtener el tipo de evento especifico

      const url = `${env.get('CALENDLY_API_BASE_URL')}/event_types/${uuid}`

      const calendlyResponse = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })

      return response.json({
        status: 'success',
        data: calendlyResponse.data,
      })
    } catch (error) {
      console.error('Error en CalendlyEventsController index:', error.message)

      return response.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al obtener los tipos de eventos.',
        error: error.message,
      })
    }
  }
  async eventTypeAvailableTimes({ params, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!
      const uuid = params.uuid

      console.log(uuid)

      // Obtener datos del usuario relacionados con Calendly
      const userData = await UsersCalendly.findBy('user_id', user.id)

      if (!userData) {
        return response.status(404).json({
          status: 'error',
          message: 'Usuario no tiene tokens asociados a Calendly.',
        })
      }

      let { access_token, refresh_token } = userData

      // Verificar si el token es válido
      try {
        // Hacer una solicitud de prueba para verificar el token
        await axios.get(`${env.get('CALENDLY_API_BASE_URL')}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expirado o inválido, intentar refrescar
          console.log('Token expirado, intentando refrescar...')
          const refreshedTokens = await this.refreshAccessToken(refresh_token)
          if (refreshedTokens) {
            access_token = refreshedTokens.access_token
            refresh_token = refreshedTokens.refresh_token

            // Guardar los nuevos tokens en la base de datos
            userData.merge({
              access_token,
              refresh_token,
            })
            await userData.save()
          } else {
            return response.status(401).json({
              status: 'error',
              message: 'No fue posible refrescar el token.',
            })
          }
        } else {
          throw error
        }
      }

      // Realizar la solicitud para obtener el tipo de evento especifico
      const event_type = params.event_type
      const end_time = params.end_time
      const start_time = params.start_time
      let queryParams = [
        `start_time=${start_time}`,
        `end_time=${end_time}`,
        `event_type=${event_type}`,
      ].join('&')
      const url = `${env.get('CALENDLY_API_BASE_URL')}/event_type_available_times?${queryParams}`
      console.log(url)

      const calendlyResponse = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })

      return response.json({
        status: 'success',
        data: calendlyResponse.data,
      })
    } catch (error) {
      console.error('Error en CalendlyEventsController index:', error.message)

      return response.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al obtener los tipos de eventos.',
        error: error.message,
      })
    }
  }
  async scheduledEvents({ request, response, auth }: HttpContext) {
    try {
      await auth.check()
      const user = auth.user!

      // Obtener datos del usuario relacionados con Calendly
      const userData = await UsersCalendly.findBy('user_id', user.id)

      if (!userData) {
        return response.status(404).json({
          status: 'error',
          message: 'Usuario no tiene tokens asociados a Calendly.',
        })
      }

      let { access_token, refresh_token, calendly_uid } = userData

      const { count, page_token, sort, status, max_start_time, min_start_time } = request.qs()

      // Verificar si el token es válido
      try {
        // Hacer una solicitud de prueba para verificar el token
        await axios.get(`${env.get('CALENDLY_API_BASE_URL')}/users/me`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expirado o inválido, intentar refrescar
          console.log('Token expirado, intentando refrescar...')
          const refreshedTokens = await this.refreshAccessToken(refresh_token)
          if (refreshedTokens) {
            access_token = refreshedTokens.access_token
            refresh_token = refreshedTokens.refresh_token

            // Guardar los nuevos tokens en la base de datos
            userData.merge({
              access_token,
              refresh_token,
            })
            await userData.save()
          } else {
            return response.status(401).json({
              status: 'error',
              message: 'No fue posible refrescar el token.',
            })
          }
        } else {
          throw error
        }
      }
      let queryParams = [`user=${calendly_uid}`, `count=${count || 10}`].join('&')

      if (page_token) queryParams += `&page_token=${page_token}`
      if (sort) queryParams += `&sort=${sort}`
      if (status) queryParams += `&status=${status}`
      if (max_start_time) queryParams += `&max_start_time=${max_start_time}`
      if (min_start_time) queryParams += `&min_start_time=${min_start_time}`

      const url = `${env.get('CALENDLY_API_BASE_URL')}/scheduled_events?${queryParams}`

      const calendlyResponse = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })

      return response.json({
        status: 'success',
        data: calendlyResponse.data,
      })
    } catch (error) {
      console.error('Error en CalendlyEventsController index:', error.message)

      return response.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al obtener los tipos de eventos.',
        error: error.message,
      })
    }
  }

  /**
   * Método para refrescar el token de acceso utilizando el refresh_token
   */
  async refreshAccessToken(refresh_token: string) {
    try {
      const tokenUrl = `${env.get('CALENDLY_AUTH_BASE_URL')}/oauth/token`
      const { data } = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: env.get('CALENDLY_CLIENT_ID'),
          client_secret: env.get('CALENDLY_CLIENT_SECRET'),
          refresh_token,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      return data
    } catch (error) {
      console.error('Error al refrescar el token de acceso:', error.message)
      return null
    }
  }
}

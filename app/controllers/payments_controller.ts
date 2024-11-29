import type { HttpContext } from '@adonisjs/core/http'

import env from '#start/env'
import { MercadoPagoConfig, PreApproval, Preference } from 'mercadopago'

export default class PaymentsController {
  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['name', 'price', 'description', 'email', 'type']) // Asume que estos campos existen
      console.log(data)

      const mercadopago = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
      })
      if (data.type === 'preaproval') {
        const info = await new PreApproval(mercadopago).create({
          body: {
            back_url: env.get('APP_URL'),
            reason: `${data.name} - ${data.description}`,
            auto_recurring: {
              frequency: 1,
              frequency_type: 'months',
              transaction_amount: data.price,
              currency_id: 'MXN',
            },
            payer_email: data.email,
            status: 'pending',
          },
        })
        return {
          status: 'success',
          code: 200,
          message: 'Modules fetched successfully',
          data: { url: info.init_point },
        }
      }
      if (data.type === 'preference') {
        const preference = new Preference(mercadopago)

        const body = {
          items: [
            {
              // id: 'item-123',
              id: '',
              title: data.name,
              description: data.description,
              picture_url:
                'https://multipreventiva.com/wp-content/uploads/2023/09/multipreventiva-plan-red-cucuta-3.png', // Cambia por una URL válida
              category_id: 'electronics', // Puedes cambiar la categoría
              quantity: 1,
              currency_id: 'MXN',
              unit_price: data.price, // Precio del producto
            },
          ],
          payer: {
            email: data.email,
          },
          back_urls: {
            success: 'http://localhost:3000/success', // Cambia por tu URL
            failure: 'http://localhost:3000/failure', // Cambia por tu URL
            pending: 'http://localhost:3000/pending', // Cambia por tu URL
          },
          auto_return: 'approved', // Redirección automática para pagos aprobados
        }
        const response = await preference.create({ body })
        console.log(response)
        return {
          status: 'success',
          code: 200,
          message: 'Modules fetched successfully',
          data: { url: response.init_point },
        }
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching Transactions',
        error: error.message,
      }
    }
  }
  public async notification({ request }: HttpContext) {
    try {
      const data = request.only(['id', 'type']) // Asume que estos campos existen

      // Solo nos interesan las notificaciones de suscripciones
      if (data.type === 'subscription_preapproval') {
        const mercadopago = new MercadoPagoConfig({
          accessToken: process.env.MP_ACCESS_TOKEN!,
        })
        // Obtenemos la suscripción
        const preapproval = await new PreApproval(mercadopago).get({ id: data.id })
        console.log(preapproval)

        // Si se aprueba, actualizamos el usuario con el id de la suscripción
        if (preapproval.status === 'authorized') {
          // Actualizamos el usuario con el id de la suscripción
          console.log('subscription creada successfily')
        }
      }

      // Respondemos con un estado 200 para indicarle que la notificación fue recibida
      //   return new Response(null, { status: 200 })

      return {
        status: 'success',
        code: 200,
        message: 'subscription creada successfily',
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching Transactions',
        error: error.message,
      }
    }
  }
  public async showSubscription({ params }: HttpContext) {
    try {
      const data = { id: params.id, type: params.type } // Asume que estos campos existen
      var info
      // Solo nos interesan las notificaciones de suscripciones
      const mercadopago = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
      })
      console.log(data)
      if (data.type === 'subscription_preapproval') {
        // Obtenemos la suscripción
        const preapproval = await new PreApproval(mercadopago).get({ id: data.id })
        console.log(preapproval)
        info = preapproval
      }
      if (data.type === 'preference') {
        // Obtenemos la preferenceia
        const preference = new Preference(mercadopago)
        const response = await preference.get({ preferenceId: 'id' })

        info = response
      }

      // Respondemos con un estado 200 para indicarle que la notificación fue recibida
      //   return new Response(null, { status: 200 })

      return {
        status: 'success',
        code: 200,
        message: 'subscription get success',
        data: info,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching Transactions',
        error: error.message,
      }
    }
  }
}

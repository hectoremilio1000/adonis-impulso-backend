// app/Controllers/Http/PaymentsController.ts

import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import { MercadoPagoConfig, Payment, PreApproval, Preference } from 'mercadopago'
import { DateTime } from 'luxon'
import Transaction from '#models/transaction'
import Subscription from '#models/subscription'

// (Opcional) Si usas DB para suscripciones y transacciones
// import Subscription from 'App/Models/Subscription'
// import Transaction from 'App/Models/Transaction'
// import { DateTime } from 'luxon'

export default class PaymentsController {
  /**
   * POST /payments
   * Crea un link de pago (checkout) según `type`.
   * - "preference" => pago puntual
   * - "preapproval" => suscripción recurrente
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'type',
        'name',
        'price',
        'description',
        'email',
        'plan_id',
        'subscription_id',
      ])
      console.log('Request Payment =>', data)
      console.log('MP Token =>', env.get('MP_ACCESS_TOKEN'))

      // 1. Inicializamos con Access Token
      const mpConfig = new MercadoPagoConfig({
        accessToken: env.get('MP_ACCESS_TOKEN')!,
      })

      // 2. Lógica según type
      if (data.type === 'preapproval') {
        // === Suscripciones recurrentes ===
        const info = await new PreApproval(mpConfig).create({
          body: {
            back_url: env.get('APP_URL'),
            reason: `${data.name} - ${data.description}`,
            auto_recurring: {
              frequency: 1,
              frequency_type: 'months',
              transaction_amount: Number(data.price),
              currency_id: 'MXN',
            },
            payer_email: data.email,
            status: 'pending',
          },
        })

        return response.ok({
          status: 'success',
          message: 'Suscripción preaprobada',
          data: { url: info.init_point },
        })
      } else if (data.type === 'preference') {
        // === Pagos puntuales ===
        const preference = new Preference(mpConfig)
        const body = {
          items: [
            {
              id: `plan-${data.plan_id}`,
              title: data.name,
              description: data.description,
              quantity: 1,
              currency_id: 'MXN',
              unit_price: Number(data.price),
            },
          ],
          payer: {
            email: data.email,
          },
          // IMPORTANT: Guardamos subscription_id (si existe) en metadata
          metadata: {
            subscription_id: data.subscription_id,
            plan_id: data.plan_id,
          },
          back_urls: {
            success: env.get('FRONT_URL') + '/success',
            failure: env.get('FRONT_URL') + '/failure',
            pending: env.get('FRONT_URL') + '/pending',
          },
          auto_return: 'approved',
          // notification_url: env.get('APP_URL') + '/payments/notification'
        }
        const result = await preference.create({ body })

        return response.ok({
          status: 'success',
          message: 'Preferencia creada (pago puntual)',
          data: { url: result.init_point },
        })
      } else {
        // type inválido
        return response.badRequest({
          status: 'error',
          message: 'Tipo de pago inválido. Usa "preapproval" o "preference".',
        })
      }
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        status: 'error',
        message: 'Error creando pago en Mercado Pago',
        error: error.message,
      })
    }
  }

  /**
   * POST /payments/notification
   * Webhook de Mercado Pago: notifica eventos ("subscription_preapproval", "payment", etc.)
   */
  public async notification({ request, response }: HttpContext) {
    try {
      const { id, type, topic } = request.qs()
      console.log('Webhook MP =>', { id, type, topic })

      const body = request.body()
      console.log('Webhook MP =>', body)

      const paymentId = body.data?.id
      console.log('paymentId =>', paymentId)

      // 1. Configurar MP
      const mpConfig = new MercadoPagoConfig({
        accessToken: env.get('MP_ACCESS_TOKEN')!,
      })

      // 2. Obtener info del pago
      const paymentObject = new Payment(mpConfig)
      const paymentResult = await paymentObject.get({ id: paymentId })
      console.log('resultado', paymentResult)

      // Sacar metadata => subscriptionId
      const metadata = paymentResult.metadata
      const subscriptionId = metadata?.subscription_id
      console.log('subscriptionId =>', subscriptionId)

      const paymentStatus = paymentResult.status // "approved", etc.
      const amount = paymentResult.transaction_amount
      const dateApproved = paymentResult.date_approved // string
      const paymentNumber = paymentId

      // -------------------
      // CREAR/ACTUALIZAR Transaction
      // -------------------
      let transaction = await Transaction.findBy('transaction_number', paymentNumber)
      if (!transaction) {
        transaction = new Transaction()
        transaction.transaction_number = Number(paymentNumber)
        transaction.subscription_id = Number(subscriptionId) // si lo necesitas
        transaction.method_payment = 'mercado_pago'
        transaction.amount = amount ?? 0
        transaction.payment_date = dateApproved || DateTime.now().toISO()
      }
      transaction.status = paymentStatus as string
      await transaction.save()

      // -------------------
      // ACTUALIZAR Suscripción
      // -------------------
      // Si es un "payment" => si status === 'approved', pasamos a 'active'
      if ((type === 'payment' || topic === 'payment') && paymentStatus === 'approved') {
        console.log('Pago normal => status=approved => actualizar suscripción en DB')

        if (subscriptionId) {
          const subscription = await Subscription.find(subscriptionId)
          if (subscription) {
            subscription.status = 'active'

            // Convertir end_date a DateTime de Luxon
            // 1) Si ya tiene end_date en la DB, lo parseamos con fromSQL
            //    (porque "YYYY-MM-DD HH:mm:ss" es formato SQL)
            let endDate: DateTime
            if (subscription.end_date) {
              // fromSQL maneja "2025-03-02 00:00:00"
              endDate = DateTime.fromSQL(subscription.end_date)

              // fallback si parse falla
              if (!endDate.isValid) {
                endDate = DateTime.now()
              }
            } else {
              // si no había end_date => partimos de hoy
              endDate = DateTime.now()
            }

            // sumamos 30 días
            endDate = endDate.plus({ days: 30 })

            // guardamos en formato SQL => "YYYY-MM-DD HH:mm:ss"
            // (sin offset)
            subscription.end_date = endDate.toSQL({ includeOffset: false })

            await subscription.save()
          }
        }
      }

      // Suscripciones recurrentes
      if (type === 'subscription_preapproval' || topic === 'subscription_preapproval') {
        const preapproval = await new PreApproval(mpConfig).get({ id })
        console.log('PreApproval =>', preapproval)

        if (preapproval.status === 'authorized') {
          // e.g. subscription.status='active'
          console.log('Suscripción recurrente autorizada')
        }
      }

      // 3. Responder OK
      return response.ok({
        status: 'success',
        message: 'Notificación recibida y procesada',
      })
    } catch (error) {
      console.error('Error en webhook MP =>', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error procesando la notificación de MP',
        error: error.message,
      })
    }
  }
  /**
   * GET /payments/show-subscription/:id?type=...
   * (Opcional) Consultar details de la preferencia/suscripción en MP
   */
  public async showSubscription({ params, request, response }: HttpContext) {
    try {
      const { type } = request.qs() // "subscription_preapproval" o "preference"
      const id = params.id
      console.log({ id, type })

      const mpConfig = new MercadoPagoConfig({
        accessToken: env.get('MP_ACCESS_TOKEN')!,
      })

      let info: any = null

      if (type === 'subscription_preapproval') {
        const preapproval = await new PreApproval(mpConfig).get({ id })
        info = preapproval
      } else if (type === 'preference') {
        const preference = new Preference(mpConfig)
        const resp = await preference.get({ preferenceId: id })
        info = resp
      }

      return response.ok({
        status: 'success',
        message: 'Detalle obtenido',
        data: info,
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        status: 'error',
        message: 'Error consultando details',
        error: error.message,
      })
    }
  }
}

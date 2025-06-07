// file: app/Controllers/Http/LegalTicketsController.ts
import type { HttpContext } from '@adonisjs/core/http'
import LegalTicket from '#models/legal_ticket'
import { join } from 'node:path'

export default class LegalTicketsController {
  /**
   * INDEX: Lista todos los tickets de asesoría legal.
   */
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      // Construimos query
      let query = LegalTicket.query().preload('user')

      // Si no es superadmin => filtra por user_id
      if (user.rol_id !== 1) {
        query.where('user_id', user.id)
      }

      const tickets = await query.orderBy('id', 'desc')
      return response.ok({
        status: 'success',
        data: tickets,
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * SHOW: Muestra un ticket individual
   */
  public async show({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const ticket = await LegalTicket.query().where('id', params.id).preload('user').first()

      if (!ticket) {
        return response.notFound({
          status: 'error',
          message: 'Solicitud no encontrada',
        })
      }

      // Checar permisos
      if (user.rol_id !== 1 && ticket.user_id !== user.id) {
        return response.unauthorized({
          status: 'error',
          message: 'No autorizado',
        })
      }

      return response.ok({
        status: 'success',
        data: ticket,
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * STORE: Crea un nuevo ticket (solicitud) de asesoría legal
   */
  public async store({ request, auth, response }: HttpContext) {
    try {
      const subject = request.input('subject')
      const description = request.input('description')
      // Si quieres permitir a un superadmin crear un ticket a nombre de otro user:
      let userId = auth.user!.id
      const frontendUserId = request.input('user_id')
      if (auth.user!.rol_id === 1 && frontendUserId) {
        userId = frontendUserId
      }

      // Validaciones simples
      if (!subject) {
        return response.badRequest({ message: 'subject es obligatorio' })
      }
      if (!description) {
        return response.badRequest({ message: 'description es obligatorio' })
      }

      // Manejo de archivos (adjuntos) si quieres
      let attachmentsNames: string[] = []
      const files = request.files('attachments[]') // <input type="file" multiple name="attachments[]" />

      if (files && files.length > 0) {
        for (let file of files) {
          if (!file.isValid) {
            console.log('Archivo inválido =>', file.errors)
            continue
          }
          await file.move(join(process.cwd(), 'uploads', 'legal'))
          if (file.fileName) {
            attachmentsNames.push(file.fileName)
          }
        }
      }

      const newTicket = await LegalTicket.create({
        user_id: userId,
        subject,
        description,
        status: 'new',
        attachments: null,
      })

      return response.created({
        status: 'success',
        message: 'Solicitud de asesoría legal creada',
        data: newTicket,
      })
    } catch (error) {
      console.error('Error al crear LegalTicket =>', error)
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * UPDATE: Actualiza un ticket
   */
  public async update({ params, request, auth, response }: HttpContext) {
    try {
      const ticket = await LegalTicket.findOrFail(params.id)
      const user = auth.user!

      // Chequeo de permisos
      if (user.rol_id !== 1 && ticket.user_id !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      // Solo unos campos permitidos
      const data = request.only(['subject', 'description', 'status'])
      // Ejemplo: validamos status
      const validStatuses = ['new', 'in_progress', 'completed', 'cancelled']
      if (data.status && !validStatuses.includes(data.status)) {
        return response.badRequest({ message: 'Estado inválido' })
      }

      ticket.merge(data)
      await ticket.save()

      return response.ok({
        status: 'success',
        message: 'Solicitud actualizada',
        data: ticket,
      })
    } catch (error) {
      console.error('Error al actualizar LegalTicket =>', error)
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * DESTROY: Elimina un ticket
   */
  public async destroy({ params, auth, response }: HttpContext) {
    try {
      const ticket = await LegalTicket.findOrFail(params.id)
      const user = auth.user!

      if (user.rol_id !== 1 && ticket.user_id !== user.id) {
        return response.unauthorized({ message: 'No autorizado' })
      }

      await ticket.delete()
      return response.ok({
        status: 'success',
        message: 'Solicitud de asesoría legal eliminada',
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }
}

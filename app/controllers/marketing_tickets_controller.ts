// file: app/controllers/marketing_tickets_controller.ts
import MarketingTicket from '#models/marketing_ticket'
import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class MarketingTicketsController {
  // GET /api/marketingTickets
  public async index({}: HttpContext) {
    try {
      const tickets = await MarketingTicket.all()
      return {
        status: 'success',
        code: 200,
        message: 'Marketing tickets fetched successfully',
        data: tickets,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching marketing tickets',
        error: error.message,
      }
    }
  }

  // GET /api/marketingTickets/:id
  public async show({ params }: HttpContext) {
    try {
      const ticket = await MarketingTicket.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Marketing ticket fetched successfully',
        data: ticket,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 404,
        message: 'Marketing ticket not found',
        error: error.message,
      }
    }
  }

  /**
   * POST /api/marketingTickets
   * Crea un ticket sin manejar archivos adjuntos.
   */
  public async store({ request }: HttpContext) {
    try {
      // Campos que envías desde el front
      const userId = request.input('user_id')
      const campaignType = request.input('campaign_type')
      const objective = request.input('objective')
      const budgetStr = request.input('budget') || '0'

      const budget = Number.parseFloat(budgetStr) || 0

      if (!campaignType || !objective) {
        return {
          status: 'error',
          code: 400,
          message: 'Faltan campos obligatorios (campaign_type, objective)',
        }
      }

      const newTicket = await MarketingTicket.create({
        user_id: userId || null,
        campaign_type: campaignType,
        objective,
        budget,
        status: 'new',
        attachments: null,
      })

      return {
        status: 'success',
        code: 201,
        message: 'Marketing ticket created successfully',
        data: newTicket,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error creating marketing ticket',
        error: error.message,
      }
    }
  }

  /**
   * POST /api/marketingTickets/upload
   * Crea un ticket con archivos adjuntos (similar a storeWithCV en CandidatesController).
   */
  public async storeWithAttachments({ request, response }: HttpContext) {
    try {
      // 1) Lee campos
      const userId = request.input('user_id')
      const campaignType = request.input('campaign_type')
      const objective = request.input('objective')
      const budgetStr = request.input('budget') || '0'
      const budget = Number.parseFloat(budgetStr) || 0

      if (!campaignType || !objective) {
        return response.badRequest({
          status: 'error',
          message: 'Faltan campos requeridos (campaign_type, objective)',
        })
      }

      // 2) Muestra el body para ver si los campos llegan
      console.log('request.body() =>', request.body())

      // 3) Leer archivos "attachments[]"
      const files = request.files('attachments[]', {
        size: '20mb',
        // extnames: ['jpg','png','jpeg','mp4','pdf'] // si quieres filtrar extensiones
      })

      // 4) Muestra el array de archivos
      console.log('files =>', files)

      // 5) Itera si recibiste archivos
      if (files.length > 0) {
        files.forEach((file) => {
          console.log('file =>', {
            clientName: file.clientName,
            extname: file.extname,
            size: file.size,
            isValid: file.isValid,
            errors: file.errors,
          })
        })
      }

      // 6) Mover los archivos válidos al storage
      const fileNames: string[] = []
      for (const file of files) {
        if (!file.isValid) {
          console.error('Archivo inválido =>', file.errors)
          continue
        }

        await file.move(app.makePath('storage', 'uploads', 'marketing'), {
          name: `${cuid()}.${file.extname}`,
        })

        if (file.fileName) {
          fileNames.push(`storage/uploads/marketing/${file.fileName}`)
        }
      }

      // 7) Crear el Ticket con las rutas de archivos
      const newTicket = await MarketingTicket.create({
        user_id: userId || null,
        campaign_type: campaignType,
        objective,
        budget,
        status: 'new',
        attachments: JSON.stringify(fileNames),
      })

      return response.ok({
        status: 'success',
        message: 'Marketing ticket created with attachments',
        data: newTicket,
      })
    } catch (error) {
      console.error('Error al crear ticket de marketing con adjuntos:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error creando ticket de marketing con adjuntos',
        error: error.message,
      })
    }
  }

  public async storeWithSingleAttachment({ request, response }: HttpContext) {
    try {
      // 1. Leer el archivo "attachment"
      const attachmentFile = request.file('attachment', {
        size: '20mb',
        // extnames: ['jpg','png','jpeg','mp4','pdf'] // si quieres validar extensiones
      })

      // Validaciones
      if (!attachmentFile) {
        return response.badRequest({
          status: 'error',
          message: 'No se recibió el archivo (attachment)',
        })
      }

      if (!attachmentFile.isValid) {
        return response.badRequest({
          status: 'error',
          errors: attachmentFile.errors,
        })
      }

      // 2. Mover el archivo
      await attachmentFile.move(app.makePath('storage', 'uploads', 'marketing'), {
        name: `${cuid()}.${attachmentFile.extname}`,
      })

      const finalFileName = attachmentFile.fileName

      // 3. Extraer campos
      const userId = request.input('user_id')
      const campaignType = request.input('campaign_type')
      const objective = request.input('objective')
      const budgetStr = request.input('budget') || '0'
      const budget = Number.parseFloat(budgetStr)

      if (!campaignType || !objective) {
        return response.badRequest({
          status: 'error',
          message: 'Faltan campos requeridos (campaign_type, objective)',
        })
      }

      // 4. Crear ticket en BD (guardando la ruta en un campo "attachment" o similar)
      const newTicket = await MarketingTicket.create({
        user_id: userId || null,
        campaign_type: campaignType,
        objective,
        budget,
        status: 'new',
        // Almacenas UNA sola ruta en attachments:
        attachments: JSON.stringify([`storage/uploads/marketing/${finalFileName}`]),
      })

      return response.ok({
        status: 'success',
        message: 'Marketing ticket creado con 1 archivo adjunto',
        data: newTicket,
      })
    } catch (error) {
      console.error('Error al crear ticket de marketing con adjunto:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error interno al crear ticket con adjunto',
        error: error.message,
      })
    }
  }

  // PUT /api/marketingTickets/:id
  public async update({ request, params }: HttpContext) {
    try {
      const ticket = await MarketingTicket.findOrFail(params.id)
      const data = request.only(['campaign_type', 'objective', 'budget', 'status', 'user_id'])

      ticket.merge(data)
      await ticket.save()

      return {
        status: 'success',
        code: 200,
        message: 'Marketing ticket updated successfully',
        data: ticket,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error updating marketing ticket',
        error: error.message,
      }
    }
  }

  // DELETE /api/marketingTickets/:id
  public async destroy({ params }: HttpContext) {
    try {
      const ticket = await MarketingTicket.findOrFail(params.id)
      await ticket.delete()

      return {
        status: 'success',
        code: 200,
        message: 'Marketing ticket deleted successfully',
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error deleting marketing ticket',
        error: error.message,
      }
    }
  }
}

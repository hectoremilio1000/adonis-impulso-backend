// app/Controllers/Http/CameraTicketsController.ts

import type { HttpContext } from '@adonisjs/core/http'
import CameraTicket from '#models/camera_ticket'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class CameraTicketsController {
  public async index({ auth }: HttpContext) {
    try {
      const user = auth.user!
      const rolId = user.rol_id

      let query = CameraTicket.query().preload('user').preload('company')

      if (rolId !== 1) {
        // Solo sus tickets
        query.where('user_id', user.id)
      }

      const tickets = await query.orderBy('id', 'desc')
      return {
        status: 'success',
        code: 200,
        message: 'Camera tickets fetched successfully',
        data: tickets,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching camera tickets',
        error: error.message,
      }
    }
  }

  public async show({ params, auth }: HttpContext) {
    try {
      const user = auth.user!
      const rolId = user.rol_id

      const ticket = await CameraTicket.query()
        .where('id', params.id)
        .preload('user')
        .preload('company')
        .first()

      if (!ticket) {
        return {
          status: 'error',
          code: 404,
          message: 'Camera ticket not found',
        }
      }

      if (rolId !== 1 && ticket.userId !== user.id) {
        return {
          status: 'error',
          code: 403,
          message: 'Not authorized to view this ticket',
        }
      }

      return {
        status: 'success',
        code: 200,
        message: 'Camera ticket fetched successfully',
        data: ticket,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching camera ticket',
        error: error.message,
      }
    }
  }

  /**
   * POST /api/camera-tickets
   * Crea un nuevo ticket de monitoreo
   */
  public async store({ request, auth }: HttpContext) {
    try {
      const user = auth.user!
      const rolId = user.rol_id

      // Campos obligatorios
      const subject = request.input('subject')
      const description = request.input('description')
      const cameraName = request.input('camera_name')
      const startTime = request.input('start_time')
      const endTime = request.input('end_time')
      const companyId = request.input('company_id') // Lo define el front

      // user_id => por defecto el actual
      let userId = user.id
      const frontUserId = request.input('user_id')
      if (rolId === 1 && frontUserId) {
        userId = frontUserId
      }

      // Validaciones mínimas
      if (!subject || !description) {
        return {
          status: 'error',
          code: 400,
          message: 'subject and description are required',
        }
      }
      if (!companyId) {
        return {
          status: 'error',
          code: 400,
          message: 'No company_id provided',
        }
      }

      // Verificar que la empresa pertenezca al usuario (si no es superadmin)
      if (rolId !== 1) {
        const userCompanies = await user.related('companies').query()
        const found = userCompanies.find((c) => c.id === Number(companyId))
        if (!found) {
          return {
            status: 'error',
            code: 403,
            message: 'No estás autorizado a crear un ticket en esa empresa',
          }
        }
      }

      // Manejo de archivos
      const attachmentsNames: string[] = []
      const files = request.files('attachments[]', { size: '20mb' })

      if (files && files.length > 0) {
        for (const file of files) {
          if (!file.isValid) {
            console.error('Archivo inválido =>', file.errors)
            continue
          }
          // Mover al folder "storage/uploads/cameras"
          await file.move(app.makePath('storage', 'uploads', 'cameras'), {
            name: `${cuid()}.${file.extname}`,
          })
          if (file.fileName) {
            attachmentsNames.push(`storage/uploads/cameras/${file.fileName}`)
          }
        }
      }

      // Crear el nuevo ticket
      const newTicket = await CameraTicket.create({
        userId,
        companyId,
        subject,
        description,
        cameraName,
        startTime,
        endTime,
        status: 'new',
        resolution: null,
        // Guardamos como JSON
        attachments: attachmentsNames.length > 0 ? JSON.stringify(attachmentsNames) : null,
      })

      return {
        status: 'success',
        code: 201,
        message: 'Camera ticket created successfully',
        data: newTicket,
      }
    } catch (error) {
      console.error('Error creating CameraTicket =>', error)
      return {
        status: 'error',
        code: 500,
        message: 'Internal server error creating camera ticket',
        error: error.message,
      }
    }
  }

  public async update({ params, request, auth }: HttpContext) {
    try {
      const user = auth.user!
      const rolId = user.rol_id

      const ticket = await CameraTicket.find(params.id)
      if (!ticket) {
        return {
          status: 'error',
          code: 404,
          message: 'Camera ticket not found',
        }
      }

      // Checar si es dueño o superadmin
      if (rolId !== 1 && ticket.userId !== user.id) {
        return {
          status: 'error',
          code: 403,
          message: 'Not authorized to edit this ticket',
        }
      }

      const validStatuses = ['new', 'in_progress', 'resolved', 'cancelled']
      const data = request.only([
        'subject',
        'description',
        'camera_name',
        'start_time',
        'end_time',
        'status',
        'resolution',
        'company_id',
      ])

      if (data.status && !validStatuses.includes(data.status)) {
        return {
          status: 'error',
          code: 400,
          message: `Invalid status, allowed: ${validStatuses.join(', ')}`,
        }
      }

      // Si está cambiando la company_id y NO es superadmin
      // => verificar que sea suya
      if (data.company_id && rolId !== 1) {
        const userCompanies = await user.related('companies').query()
        const found = userCompanies.find((c) => c.id === Number(data.company_id))
        if (!found) {
          return {
            status: 'error',
            code: 403,
            message: 'You are not authorized to set that company',
          }
        }
      }

      ticket.merge(data)
      await ticket.save()

      return {
        status: 'success',
        code: 200,
        message: 'Camera ticket updated successfully',
        data: ticket,
      }
    } catch (error) {
      console.error('Error updating CameraTicket =>', error)
      return {
        status: 'error',
        code: 500,
        message: 'Internal server error updating camera ticket',
        error: error.message,
      }
    }
  }

  public async destroy({ params, auth }: HttpContext) {
    try {
      const user = auth.user!
      const rolId = user.rol_id

      const ticket = await CameraTicket.find(params.id)
      if (!ticket) {
        return {
          status: 'error',
          code: 404,
          message: 'Camera ticket not found',
        }
      }

      if (rolId !== 1 && ticket.userId !== user.id) {
        return {
          status: 'error',
          code: 403,
          message: 'Not authorized to delete this ticket',
        }
      }

      await ticket.delete()

      return {
        status: 'success',
        code: 200,
        message: 'Camera ticket deleted successfully',
      }
    } catch (error) {
      console.error('Error deleting CameraTicket =>', error)
      return {
        status: 'error',
        code: 500,
        message: 'Internal server error deleting camera ticket',
        error: error.message,
      }
    }
  }
  public async storeWithSingleAttachment({ request, auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const rolId = user.rol_id

      // 1) Campos obligatorios
      const subject = request.input('subject')
      const description = request.input('description')
      const cameraName = request.input('camera_name')
      const startTime = request.input('start_time')
      const endTime = request.input('end_time')
      const companyId = request.input('company_id')

      // user_id => por defecto el actual
      let userId = user.id
      const frontUserId = request.input('user_id')
      if (rolId === 1 && frontUserId) {
        userId = frontUserId
      }

      // Validaciones mínimas
      if (!subject || !description) {
        return response.badRequest({
          status: 'error',
          message: 'subject y description son requeridos',
        })
      }
      if (!companyId) {
        return response.badRequest({
          status: 'error',
          message: 'Falta company_id',
        })
      }

      // Verificar que la empresa pertenezca al usuario (si no es superadmin)
      if (rolId !== 1) {
        const userCompanies = await user.related('companies').query()
        const found = userCompanies.find((c) => c.id === Number(companyId))
        if (!found) {
          return response.forbidden({
            status: 'error',
            message: 'No estás autorizado para esa empresa',
          })
        }
      }

      // 2) Leer el archivo "attachment" (un solo archivo)
      const attachmentFile = request.file('attachment', {
        size: '20mb',
      })

      let finalFilePath: string | null = null

      if (attachmentFile) {
        if (!attachmentFile.isValid) {
          return response.badRequest({
            status: 'error',
            errors: attachmentFile.errors,
          })
        }

        // Mover el archivo a storage/uploads/cameras
        await attachmentFile.move(app.makePath('storage', 'uploads', 'cameras'), {
          name: `${cuid()}.${attachmentFile.extname}`,
        })

        if (attachmentFile.fileName) {
          // Guardar la ruta
          finalFilePath = `storage/uploads/cameras/${attachmentFile.fileName}`
        }
      }

      // 3) Crear el ticket
      const newTicket = await CameraTicket.create({
        userId,
        companyId,
        subject,
        description,
        cameraName,
        startTime: startTime ? DateTime.fromISO(startTime) : null,
        endTime: endTime ? DateTime.fromISO(endTime) : null,
        status: 'new',
        resolution: null,
        // Guardar la ruta como JSON en "attachments"
        attachments: finalFilePath ? JSON.stringify([finalFilePath]) : null,
      })

      return response.created({
        status: 'success',
        code: 201,
        message: 'Camera ticket created successfully (single attachment)',
        data: newTicket,
      })
    } catch (error) {
      console.error('Error creating CameraTicket =>', error)
      return response.internalServerError({
        status: 'error',
        message: 'Internal server error creating camera ticket',
        error: error.message,
      })
    }
  }
}

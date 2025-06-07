// file: /app/Controllers/Http/TicketsWebController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Request from '#models/request'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class TicketsWebController {
  /**
   * 1) Lista todas las solicitudes (tickets web)
   */
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      let query = Request.query().preload('user')

      // Filtra si no es superadmin
      if (user.rol_id !== 1) {
        query.where('user_id', user.id)
      }

      const requests = await query.orderBy('id', 'desc')

      return response.ok({
        status: 'success',
        data: requests,
      })
    } catch (error) {
      console.error('[TicketsWebController.index] error =>', error)
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * 2) Mostrar detalle de un ticket
   */
  public async show({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const requestItem = await Request.query().where('id', params.id).preload('user').first()

      if (!requestItem) {
        return response.notFound({ status: 'error', message: 'No se encontró la solicitud' })
      }

      // Checar permisos
      if (user.rol_id !== 1 && requestItem.user_id !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      return response.ok({
        status: 'success',
        data: requestItem,
      })
    } catch (error) {
      console.error('[TicketsWebController.show] error =>', error)
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * 3) Crear una solicitud con archivo único (similar a storeSingle)
   *    Campos esperados: title, description, user_id, y attachments[] (un archivo)
   */
  public async store({ request, auth, response }: HttpContext) {
    try {
      // 1. Leer el archivo "attachment"
      const attachmentFile = request.file('attachment', {
        size: '20mb',
        // extnames: ['jpg','jpeg','png','pdf'] // opcional, si deseas filtrar
      })

      // 2. Valida si llegó el archivo
      //    (Es opcional, así que no forzamos a que *tenga* que venir el archivo)
      //    Si quieres forzarlo, sólo revisa que attachmentFile exista.
      if (attachmentFile && !attachmentFile.isValid) {
        return response.badRequest({
          status: 'error',
          message: 'Archivo no válido',
          errors: attachmentFile.errors,
        })
      }

      // 3. Mover el archivo si existe
      let attachmentPath: string | null = null
      if (attachmentFile) {
        const finalName = `${cuid()}.${attachmentFile.extname}`
        await attachmentFile.move(app.makePath('storage', 'uploads', 'requests-web'), {
          name: finalName,
        })
        attachmentPath = `storage/uploads/requests-web/${finalName}`
      }

      // 4. Leer los demás campos
      const user = auth.user!
      const title = request.input('title')
      const description = request.input('description')
      let userId = request.input('user_id')

      // Si no eres superadmin, forzamos userId al actual
      if (user.rol_id !== 1) {
        userId = user.id
      }

      // Validaciones mínimas
      if (!title || !title.trim()) {
        return response.badRequest({ message: 'El campo "title" es obligatorio' })
      }
      if (title.length > 255) {
        return response.badRequest({ message: 'El título no puede exceder 255 caracteres' })
      }
      if (!description || !description.trim()) {
        return response.badRequest({ message: 'El campo "description" es obligatorio' })
      }

      // 5. Insertar en DB
      //    Como en tu tabla "requests" tienes un campo "attachments" de tipo JSON
      //    y aquí sólo subimos UN archivo, lo guardamos en un array de 1 posición:
      const attachmentsArray = []
      if (attachmentPath) {
        attachmentsArray.push(attachmentPath)
      }

      const newRequest = await Request.create({
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        status: 'pending',
        attachments: JSON.stringify(attachmentsArray),
      })

      // 6. Respuesta
      return response.created({
        status: 'success',
        message: 'Solicitud creada correctamente',
        data: newRequest,
      })
    } catch (error) {
      console.error('[TicketsWebController.store] error =>', error)
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * 4) Actualizar una solicitud (title, description, status)
   */
  public async update({ params, request, auth, response }: HttpContext) {
    try {
      // 1. Obtenemos campos a actualizar
      const data = request.only(['title', 'description', 'status'])

      // 2. Buscar la Request
      const ticket = await Request.findOrFail(params.id)

      // 3. Permisos
      if (auth.user?.rol_id !== 1 && ticket.user_id !== auth.user?.id) {
        return response.unauthorized({ message: 'No autorizado' })
      }

      // 4. Actualizar
      if (data.title !== undefined) {
        if (!data.title.trim()) {
          return response.badRequest({ message: 'El campo "title" no puede ser vacío' })
        }
        if (data.title.length > 255) {
          return response.badRequest({ message: 'El título no puede exceder 255 caracteres' })
        }
        ticket.title = data.title
      }
      if (data.description !== undefined) {
        if (!data.description.trim()) {
          return response.badRequest({ message: 'El campo "description" no puede ser vacío' })
        }
        ticket.description = data.description
      }
      if (data.status !== undefined) {
        const validStatuses = ['pending', 'in_progress', 'completed', 'rejected']
        if (!validStatuses.includes(data.status)) {
          return response.badRequest({ message: 'Status inválido' })
        }
        ticket.status = data.status
      }

      await ticket.save()

      return {
        status: 'success',
        message: 'Solicitud actualizada',
        data: ticket,
      }
    } catch (error) {
      console.error('[TicketsWebController.update] error =>', error)
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * 5) Eliminar una solicitud
   */
  public async destroy({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const requestToDelete = await Request.findOrFail(params.id)

      // Chequeo de permisos
      if (user.rol_id !== 1 && requestToDelete.user_id !== user.id) {
        return response.unauthorized({
          status: 'error',
          message: 'No autorizado',
        })
      }

      await requestToDelete.delete()

      return response.ok({
        status: 'success',
        message: 'Solicitud eliminada',
      })
    } catch (error) {
      console.error('[TicketsWebController.destroy] error =>', error)
      return response.internalServerError({
        status: 'error',
        message: error.message,
      })
    }
  }
}

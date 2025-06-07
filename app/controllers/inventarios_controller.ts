// app/Controllers/Http/InventariosController.ts
import type { HttpContext } from '@adonisjs/core/http'

import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import Inventory from '#models/inventory'

export default class InventariosController {
  /**
   * GET /api/inventarios
   * Lista todos los tickets de inventario. Si no es superadmin, filtra por user_id
   */
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const query = Inventory.query().preload('user')

      if (user.rol_id !== 1) {
        query.where('user_id', user.id)
      }

      const data = await query.orderBy('id', 'desc')
      return response.ok({ status: 'success', data })
    } catch (error) {
      console.error('[InventariosController.index]', error)
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * GET /api/inventarios/:id
   */
  public async show({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const item = await Inventory.query().where('id', params.id).preload('user').first()

      if (!item) {
        return response.notFound({ status: 'error', message: 'No se encontró el inventario' })
      }

      // Checar permisos
      if (user.rol_id !== 1 && item.userId !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      return response.ok({ status: 'success', data: item })
    } catch (error) {
      console.error('[InventariosController.show]', error)
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * POST /api/inventarios
   * Crea un ticket de inventario con un archivo adjunto opcional (attachment).
   */
  public async store({ request, auth, response }: HttpContext) {
    try {
      const user = auth.user!

      // 1) Leer archivo
      const file = request.file('attachment', {
        size: '20mb',
        // extnames: ['jpg', 'png', 'pdf'] // si quieres filtrar
      })

      if (file && !file.isValid) {
        return response.badRequest({
          status: 'error',
          message: 'Archivo inválido',
          errors: file.errors,
        })
      }

      let attachmentPath = null
      if (file) {
        const finalName = `${cuid()}.${file.extname}`
        await file.move(app.makePath('storage', 'uploads', 'inventarios'), {
          name: finalName,
        })
        attachmentPath = `storage/uploads/inventarios/${finalName}`
      }

      // 2) Leer campos
      let userId = request.input('user_id')
      const title = request.input('title')
      const description = request.input('description') || ''
      const tipoInventario = request.input('tipo_inventario') // "un_producto", "varios", "todos"
      const priority = request.input('priority') || 'normal'

      // Si no es superadmin, forzamos su userId
      if (user.rol_id !== 1) {
        userId = user.id
      }

      // Validaciones mínimas
      if (!title || !title.trim()) {
        return response.badRequest({ message: 'Falta el título' })
      }
      if (!tipoInventario) {
        return response.badRequest({ message: 'Falta el tipo de inventario' })
      }

      const attachmentsArray = []
      if (attachmentPath) {
        attachmentsArray.push(attachmentPath)
      }

      // 3) Insertar en DB
      const newItem = await Inventory.create({
        userId,
        title: title.trim(),
        description: description.trim(),
        tipoInventario,
        priority,
        status: 'pending',
        attachments: JSON.stringify(attachmentsArray),
      })

      return response.created({
        status: 'success',
        message: 'Ticket de Inventario creado',
        data: newItem,
      })
    } catch (error) {
      console.error('[InventariosController.store]', error)
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * PUT /api/inventarios/:id
   * Actualiza campos como title, tipo_inventario, priority, status, etc.
   */
  public async update({ params, request, auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const item = await Inventory.findOrFail(params.id)

      // Checar permisos
      if (user.rol_id !== 1 && item.userId !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      // Leer campos
      const data = request.only(['title', 'description', 'tipo_inventario', 'priority', 'status'])

      // Validar si quieres
      if (data.title && data.title.length > 255) {
        return response.badRequest({ message: 'Título demasiado largo' })
      }

      item.merge(data)
      await item.save()

      return {
        status: 'success',
        message: 'Inventario actualizado',
        data: item,
      }
    } catch (error) {
      console.error('[InventariosController.update]', error)
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }

  /**
   * DELETE /api/inventarios/:id
   */
  public async destroy({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const item = await Inventory.findOrFail(params.id)

      // Checar permisos
      if (user.rol_id !== 1 && item.userId !== user.id) {
        return response.unauthorized({ status: 'error', message: 'No autorizado' })
      }

      await item.delete()

      return response.ok({ status: 'success', message: 'Inventario eliminado' })
    } catch (error) {
      console.error('[InventariosController.destroy]', error)
      return response.internalServerError({ status: 'error', message: error.message })
    }
  }
}

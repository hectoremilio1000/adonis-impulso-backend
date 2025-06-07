// file: app/Controllers/PuntoVentaTicketsController.ts
import PuntoVentaTicket from '#models/punto_venta_ticket'
import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class PuntoVentaTicketsController {
  // GET /api/punto-venta-tickets
  public async index({}: HttpContext) {
    try {
      // Puedes hacer .preload('user') si quieres cargar info de usuario
      const tickets = await PuntoVentaTicket.query().orderBy('id', 'desc')
      return {
        status: 'success',
        code: 200,
        message: 'PuntoVenta tickets fetched successfully',
        data: tickets,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching punto_venta_tickets',
        error: error.message,
      }
    }
  }

  // GET /api/punto-venta-tickets/:id
  public async show({ params }: HttpContext) {
    try {
      const ticket = await PuntoVentaTicket.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Ticket de Punto de Venta',
        data: ticket,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 404,
        message: 'Ticket not found',
        error: error.message,
      }
    }
  }

  /**
   * POST /api/punto-venta-tickets/uploadSingle
   * Crea un ticket subiendo un solo archivo (foto).
   */
  public async storeSingle({ request, response }: HttpContext) {
    try {
      // 1) Leer campos
      const userId = request.input('user_id')
      const tituloProblema = request.input('titulo_problema')
      const descripcionProblema = request.input('descripcion_problema')
      const urgencia = request.input('urgencia') || 'baja'
      const whatsapp = request.input('whatsapp') || null

      // Validar
      if (!tituloProblema || !descripcionProblema) {
        return response.badRequest({
          status: 'error',
          message: 'Faltan campos requeridos: titulo_problema, descripcion_problema',
        })
      }

      // 2) Leer archivo "foto"
      const fotoFile = request.file('foto', {
        size: '20mb',
        // extnames: ['jpg','png','jpeg','pdf'] => si quieres filtrar
      })

      let fotoPath = null
      if (fotoFile) {
        if (!fotoFile.isValid) {
          return response.badRequest({
            status: 'error',
            errors: fotoFile.errors,
          })
        }

        // 3) Mover el archivo
        // p.ej. a storage/uploads/punto_venta
        await fotoFile.move(app.makePath('storage/uploads/punto_venta'), {
          name: `${cuid()}.${fotoFile.extname}`,
        })

        if (fotoFile.fileName) {
          fotoPath = `storage/uploads/punto_venta/${fotoFile.fileName}`
        }
      }

      // 4) Crear registro en DB
      const newTicket = await PuntoVentaTicket.create({
        user_id: userId || null,
        titulo_problema: tituloProblema,
        descripcion_problema: descripcionProblema,
        urgencia,
        whatsapp,
        foto: fotoPath,
        status: 'new',
      })

      return response.ok({
        status: 'success',
        message: 'Ticket de Punto de Venta creado',
        data: newTicket,
      })
    } catch (error) {
      console.error('Error al crear ticket punto de venta:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error interno al crear ticket punto de venta',
        error: error.message,
      })
    }
  }

  // PUT /api/punto-venta-tickets/:id
  public async update({ request, params }: HttpContext) {
    try {
      const ticket = await PuntoVentaTicket.findOrFail(params.id)

      // Solo ejemplo: actualizamos status (o lo que gustes)
      const { status } = request.only(['status'])
      if (status) {
        ticket.status = status
      }
      // Podrías actualizar otros campos (titulo, desc, etc.)
      await ticket.save()

      return {
        status: 'success',
        code: 200,
        message: 'PuntoVenta ticket updated',
        data: ticket,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error updating punto_venta ticket',
        error: error.message,
      }
    }
  }

  // DELETE /api/punto-venta-tickets/:id
  public async destroy({ params }: HttpContext) {
    try {
      const ticket = await PuntoVentaTicket.findOrFail(params.id)
      await ticket.delete()

      return {
        status: 'success',
        code: 200,
        message: 'PuntoVenta ticket deleted',
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error deleting punto_venta ticket',
        error: error.message,
      }
    }
  }
}

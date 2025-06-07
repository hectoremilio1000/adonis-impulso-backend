import Candidate from '#models/candidate'
import Company from '#models/company'
import Employee from '#models/employee'
import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class CandidatesController {
  // GET /api/candidates
  public async index({}: HttpContext) {
    try {
      const candidates = await Candidate.all()
      return {
        status: 'success',
        code: 200,
        message: 'Candidates fetched successfully',
        data: candidates,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching candidates',
        error: error.message,
      }
    }
  }

  // GET /api/candidates/:id
  public async show({ params }: HttpContext) {
    try {
      const candidate = await Candidate.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Candidate fetched successfully',
        data: candidate,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 404,
        message: 'Candidate not found',
        error: error.message,
      }
    }
  }

  // POST /api/candidates
  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['candidate'])

      if (!data || !data.candidate) {
        return {
          status: 'error',
          code: 400,
          message: 'Missing candidate data',
        }
      }

      const candidate = await Candidate.create(data.candidate)
      return {
        status: 'success',
        code: 201,
        message: 'Candidate created successfully',
        data: candidate,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error creating candidate',
        error: error.message,
      }
    }
  }

  // POST /api/candidates/upload (con CV)
  public async storeWithCV({ request, response }: HttpContext) {
    try {
      // 1. Leer el archivo "cv"
      const cvFile = request.file('cv', {
        size: '10mb',
        extnames: ['pdf', 'doc', 'docx', 'jpg', 'png'],
      })

      if (!cvFile) {
        return response.badRequest({
          status: 'error',
          message: 'No se recibió el archivo CV',
        })
      }

      if (!cvFile.isValid) {
        return response.badRequest({
          status: 'error',
          errors: cvFile.errors,
        })
      }

      // 2. Mover el archivo
      await cvFile.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${cvFile.extname}`,
      })

      const finalFileName = cvFile.fileName!

      // 3. Extraer campos
      const nombre = request.input('nombre')
      const whatsapp = request.input('whatsapp')
      const email = request.input('email')
      const puesto = request.input('puesto')

      if (!nombre || !whatsapp || !email || !puesto) {
        return response.badRequest({
          status: 'error',
          message: 'Faltan campos requeridos (nombre, whatsapp, email, puesto)',
        })
      }

      // Referencias (opcional)
      const ref1Company = request.input('referencia1_empresa')
      const ref1Cargo = request.input('referencia1_cargo')
      const ref1Name = request.input('referencia1_nombre')
      const ref1Time = request.input('referencia1_tiempo')
      const ref1Whatsapp = request.input('referencia1_whatsapp')

      const ref2Company = request.input('referencia2_empresa')
      const ref2Cargo = request.input('referencia2_cargo')
      const ref2Name = request.input('referencia2_nombre')
      const ref2Time = request.input('referencia2_tiempo')
      const ref2Whatsapp = request.input('referencia2_whatsapp')

      // Leer company_id que llega del frontend
      const companyId = request.input('company_id')

      // 4. Guardar en BD
      const newCandidate = await Candidate.create({
        name: nombre,
        whatsapp,
        email,
        position: puesto,
        cv_path: `storage/uploads/${finalFileName}`,

        reference1Company: ref1Company,
        reference1Position: ref1Cargo,
        reference1Name: ref1Name,
        reference1Timeworked: ref1Time,
        reference1Whatsapp: ref1Whatsapp,

        reference2Company: ref2Company,
        reference2Position: ref2Cargo,
        reference2Name: ref2Name,
        reference2Timeworked: ref2Time,
        reference2Whatsapp: ref2Whatsapp,

        status: 'To Review',
        company_id: companyId ? Number(companyId) : null,
      })

      return response.ok({
        status: 'success',
        message: 'Candidato creado con CV',
        data: newCandidate,
      })
    } catch (error) {
      console.error('Error al guardar candidato con CV:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error interno al guardar candidato con CV',
        error: error.message,
      })
    }
  }

  // PUT /api/candidates/comments
  public async updateComments({ request, response }: HttpContext) {
    try {
      const id = request.input('id')
      const comments = request.input('comments')

      const candidate = await Candidate.findOrFail(id)
      candidate.comments = comments
      await candidate.save()

      return response.ok({
        status: 'success',
        message: 'Comentarios actualizados',
        data: candidate,
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'No se pudo actualizar comentarios',
        error: error.message,
      })
    }
  }

  // PUT /api/candidates/status
  public async updateStatus({ request, response, auth }: HttpContext) {
    try {
      const id = request.input('id')
      const newStatus = request.input('status')
      const comments = request.input('comments') || ''

      // <-- AÑADIDO: recuperar el usuario que está haciendo la operación
      await auth.check()
      const currentUser = auth.user // superadmin o admin
      const currentUserId = currentUser?.id

      const candidate = await Candidate.findOrFail(id)
      const oldStatus = candidate.status

      // Actualizamos el status
      candidate.status = newStatus
      candidate.comments = comments
      await candidate.save()

      // 1) Si pasa a "Approved" => creamos Employee y User
      if (newStatus === 'Approved' && oldStatus !== 'Approved') {
        // Obtenemos el company_id
        const companyId = candidate.company_id || 1
        await Company.findOrFail(companyId)

        // Asegúrate de tener en tu BD: roles.id = 4
        const randomPassword = Math.random().toString(36).substring(2, 8)
        const newUser = await User.create({
          name: candidate.name,
          email: candidate.email,
          password: randomPassword,
          whatsapp: candidate.whatsapp, // o phone
          rol_id: 4, // "employee"
          created_by: currentUserId, // <-- AÑADIDO: para saber quién lo creó
          isActive: true,
        })

        // Crea Employee
        await Employee.create({
          name: candidate.name,
          email: candidate.email,
          phone: candidate.whatsapp,
          position: candidate.position,
          candidateId: candidate.id,
          company_id: companyId,
          userId: newUser.id, // <-- link al user
          createdBy: currentUserId, // <-- AÑADIDO
        })

        // Crea user con rol=4 => "employee"
      }

      // 2) Si estaba "Approved" y ahora ya no => borramos Employee & User
      if (oldStatus === 'Approved' && newStatus !== 'Approved') {
        // Buscar Employee
        const employee = await Employee.query().where('candidate_id', candidate.id).first()
        if (employee) {
          await employee.delete()
        }

        // Buscar User por email con rol=4 => borrarlo
        const user = await User.findBy('email', candidate.email)
        if (user && user.rol_id === 4) {
          await user.delete()
        }
      }

      return response.ok({
        status: 'success',
        message: 'Estado actualizado + creación/eliminación de Employee+User',
        data: candidate,
      })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        status: 'error',
        message: 'No se pudo actualizar estado',
        error: error.message,
      })
    }
  }

  // POST /api/candidates/:id/hire (opcional)
  public async hire({ params, request, auth, response }: HttpContext) {
    try {
      await auth.check()

      const candidateId = params.id
      const companyId = request.input('companyId')

      const candidate = await Candidate.findOrFail(candidateId)

      if (candidate.status !== 'Approved') {
        return response.badRequest({
          message: 'Sólo puedes contratar candidatos en status "Approved"',
        })
      }

      await Company.findOrFail(companyId)

      // Crea Empleado
      await Employee.create({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.whatsapp,
        position: candidate.position,
        candidateId: candidate.id,
        company_id: companyId,
      })

      // Crea User rol=4
      const randomPassword = Math.random().toString(36).substring(2, 8)
      await User.create({
        name: candidate.name,
        email: candidate.email,
        password: randomPassword,
        rol_id: 4,
      })

      return {
        status: 'success',
        message: 'Candidato contratado con éxito',
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al contratar candidato',
        error: error.message,
      })
    }
  }
}

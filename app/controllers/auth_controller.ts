import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import Mail from '@adonisjs/mail/services/main'
import { v4 as uuidv4 } from 'uuid'

import env from '#start/env'
import Employee from '#models/employee'

export default class AuthController {
  public async index({ response }: HttpContext) {
    try {
      const users = await User.query()
        .preload('rol')
        .preload('companies')
        .preload('subscription') // <--- Asegúrate de precargar la relación
        .orderBy('id', 'asc')

      return response.status(200).json({
        status: 'success',
        code: 200,
        message: 'Users fetched successfully',
        data: users,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        code: 500,
        message: 'Error al obtener usuarios',
        error: error.message,
      })
    }
  }

  public async register({ request }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)
    return User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days',
    })
  }

  async createUser({ request }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const user = await User.create(data)
      return {
        status: 'success',
        code: 201,
        message: 'Usuario Creado correctamente',
        data: user,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creating plan',
        error: error.message,
      }
    }
  }

  public async login({ request, response }: HttpContext) {
    // 1. Verificar credenciales
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)

    // 2. Crear el token con el provider nativo
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days',
    })

    // 2) Verificar isActive
    if (!user?.isActive) {
      return response.badRequest({
        status: 'error',
        message: 'Este usuario está desactivado. Contacta al administrador',
      })
    }

    // 3. El token devuelto incluye `.value!.release()` para leerlo en claro
    return response.json({
      status: 'success',
      // Este es el token real para usar en "Bearer <token>"
      token: token.value!.release(),
      expires_at: token.expiresAt,
    })
  }

  public async logout({ auth }: HttpContext) {
    // Requerimos el token actual
    await auth.use('api').authenticate()
    const user = auth.user!

    // Borramos el token de la DB
    // identifier es la PK del token en DB
    await User.accessTokens.delete(user, user.currentAccessToken!.identifier)

    return { message: 'success' }
  }

  public async me({ auth }: HttpContext) {
    await auth.use('api').authenticate()

    // Cargamos el usuario desde DB + preload del rol
    await auth.use('api').authenticate()

    // Toma el ID del usuario autenticado:
    const userId = auth.user!.id

    const user = await User.query()
      .where('id', userId)
      .preload('rol')
      .preload('companies')
      .preload('subscription', (subscriptionQuery) => {
        subscriptionQuery.preload('plan') // si necesitas plan
        subscriptionQuery.preload('modules') // AQUI precargamos los módulos
      })
      .firstOrFail()

    return { user }
  }

  public async registerProspect({ request, response }: HttpContext) {
    try {
      const { name, email, password } = request.only(['name', 'email', 'password'])

      // Ver si ya existe
      const existing = await User.findBy('email', email)
      if (existing) {
        return response.status(400).json({
          success: false,
          message: 'El correo ya está registrado',
        })
      }

      // Asignar role_id = 3 => 'prospect'
      const user = await User.create({
        name,
        email,
        password,
        rol_id: 3, // O el ID que uses para prospect
      })

      return response.json({
        success: true,
        message: 'Usuario creado como prospecto',
        data: user,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        success: false,
        message: 'Error al crear prospecto',
      })
    }
  }
  public async forgotPassword({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])
      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).json({
          success: false,
          message: 'No existe usuario con ese email',
        })
      }

      // Generar token
      const resetToken = uuidv4()
      // asumiendo que tienes un campo en la tabla users: password_reset_token
      user.password_reset_token = resetToken
      await user.save()

      // Leer la variable de entorno
      const frontendUrl = env.get('FRONTEND_URL', 'http://localhost:3000')
      // Construir el link
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`

      // Enviar correo
      await Mail.send((message) => {
        message
          .to(user.email)
          .from(env.get('SMTP_USERNAME')) // <--- usar el mismo "from" que en ProspectsController
          .subject('Recuperar contraseña').html(`
            <html>
              <body>
                <h1>Recupera tu contraseña</h1>
                <p>Tu token de recuperación es: ${resetToken}</p>
                <p>Haz click para ir a la pantalla de reestablecer contraseña:</p>
                <a href="${resetLink}">Resetear Contraseña</a>
                <br />
                <p>O copia y pega en tu navegador: ${resetLink}</p>
              </body>
            </html>
          `)
      })

      return response.json({ success: true, message: 'Correo enviado' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        success: false,
        message: 'Error interno olvidé contraseña',
      })
    }
  }

  public async resetPassword({ request, response }: HttpContext) {
    try {
      const { token, newPassword } = request.only(['token', 'newPassword'])
      const user = await User.findBy('password_reset_token', token)
      if (!user) {
        return response.status(404).json({ success: false, message: 'Token inválido' })
      }

      user.password = newPassword
      user.password_reset_token = null
      await user.save()

      return response.json({ success: true, message: 'Contraseña actualizada' })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        success: false,
        message: 'Error al resetear contraseña',
      })
    }
  }

  // file: app/Controllers/Http/AuthController.ts

  public async updateUser({ params, request, response }: HttpContext) {
    try {
      // 1. Buscar al usuario
      const user = await User.findOrFail(params.id)

      // 2. Campos que se pueden actualizar (name, whatsapp, etc.)
      const data = request.only(['name', 'whatsapp'])
      user.merge(data)

      // 3. Guardar
      await user.save()

      return {
        status: 'success',
        message: 'Usuario actualizado correctamente',
        data: user,
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo actualizar el usuario',
        error: error.message,
      })
    }
  }

  public async listWithoutRecommendation({ response }: HttpContext) {
    try {
      // Queremos todos los usuarios que NO tengan una recomendación
      // leftJoin con 'recommendations' y filtramos donde recommendation.id es null
      const usersNoRec = await User.query()
        .leftJoin('recommendations', 'users.id', 'recommendations.user_id')
        .whereNull('recommendations.id')
        .select('users.id', 'users.name', 'users.email') // lo que quieras

      return response.json(usersNoRec)
    } catch (error) {
      console.error(error)
      return response.status(500).json({ status: 'error', message: error.message })
    }
  }
  public async showUser({ params, response }: HttpContext) {
    try {
      // Usamos query() + preload
      const user = await User.query()
        .where('id', params.id)
        .preload('rol')
        .preload('creator')
        .preload('companies') // si es rol=2 (admin) => sus companies
        .preload('employees', (empQuery) => {
          // Aquí TS reconocerá 'empQuery' como un "Query builder de Employee"
          empQuery.preload('company')
        })
        .preload('subscription')
        .firstOrFail()

      return {
        status: 'success',
        data: user,
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al obtener usuario',
        error: error.message,
      })
    }
  }

  // app/Controllers/Http/AuthController.ts

  // ...
  // app/Controllers/Http/AuthController.ts

  public async debugCreateToken({ request, response }: HttpContext) {
    try {
      const { userId } = request.only(['userId'])

      const user = await User.findOrFail(userId)
      const tokenResult = await User.accessTokens.create(user, [], {
        expiresIn: '30 days',
      })

      // Forzar un cast a any (o a una interfaz que declare plainToken)
      const plainToken = (tokenResult as any).plainToken

      console.log('debugCreateToken => plainToken:', plainToken)

      return response.json({
        status: 'success',
        token: plainToken,
        expires_at: tokenResult.expiresAt,
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: error.message })
    }
  }
  public async destroyUser({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete() // O user.isActive=false
      return response.json({ status: 'success', message: 'Usuario eliminado' })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'No se pudo eliminar el usuario',
        error: error.message,
      })
    }
  }

  public async userCompanies({ params, response }: HttpContext) {
    try {
      const userId = params.userId

      // Ejemplo #1: si tu User tiene una relación "companies" (belongsToMany, hasMany, etc.)
      const user = await User.findOrFail(userId)
      await user.load('companies') // asumiendo que en tu User.ts definiste => this.hasMany('App/Models/Company') o belongsToMany
      return response.json({
        status: 'success',
        data: user.companies,
      })

      // Ejemplo #2 (alternativo): Si las "empresas de un usuario" las obtienes de Employees:
      // const companies = await Company.query()
      //   .join('employees', 'employees.company_id', 'companies.id')
      //   .where('employees.user_id', userId)
      //   .select('companies.*')
      // return response.json({ status: 'success', data: companies })
    } catch (error) {
      console.error('Error in userCompanies =>', error)
      return response.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  }

  /**
   * GET /api/users/:userId/companies/:companyId/positions
   * Retorna los “positions” disponibles para ese userId en esa companyId.
   */
  public async userCompanyPositions({ params, response }: HttpContext) {
    try {
      const { userId, companyId } = params

      // Ejemplo #1: Si usas un modelo Employee que relaciona un user con una company, y ahí está el position_id
      // Buscas todos los empleados que coincidan con userId y companyId, y precargas 'position':
      const employees = await Employee.query()
        .where('user_id', userId)
        .where('company_id', companyId)
        .preload('position') // asumiendo que en Employee.ts: this.belongsTo(() => Position)

      // Sacamos sólo los positions distintos (si hubiera más de uno):
      const positions = employees.map((emp) => emp.position).filter(Boolean)

      return response.json({
        status: 'success',
        data: positions,
      })

      // Ejemplo #2: Si hay una relación many-to-many entre Company y Position,
      // y primero quieres filtrar las positions que un user “puede ver”:
      // const company = await Company.findOrFail(companyId)
      // await company.load('positions') // asumiendo hasMany o manyToMany
      // return response.json({ status: 'success', data: company.positions })

      // Ejemplo #3: Si “todas” las positions son válidas, independientemente de userId,
      // bastaría con un index global: GET /api/positions?companyId=...
    } catch (error) {
      console.error('Error in userCompanyPositions =>', error)
      return response.status(500).json({
        status: 'error',
        message: error.message,
      })
    }
  }
}

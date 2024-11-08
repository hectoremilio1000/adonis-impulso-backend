import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request }: HttpContext) {
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

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    return User.accessTokens.create(user)
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    const data_auth = await auth.check()
    if (data_auth === false) {
      return { user: data_auth }
    } else {
      // Cargar el usuario autenticado junto con el rol y el creador
      const user = await User.query()
        .where('id', auth.user!.id)
        .preload('rol')
        // .preload('creator') // Pre-cargar la relación 'creator' (autorreferencial)
        .firstOrFail()

      // Devolver el usuario con los datos de rol y creador
      return { user }
    }
  }
}

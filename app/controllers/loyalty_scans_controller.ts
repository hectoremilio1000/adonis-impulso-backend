import LoyaltyCard from '#models/loyalty_card'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoyaltyScanController {
  /**
   * GET /api/loyalty/scan?code=XXXX
   * Muestra un formulario HTML que pide "PIN" + "code".
   */
  public async scan({ request, response }: HttpContext) {
    const code = request.input('code')

    // Si no llega el 'code'
    if (!code) {
      return response.send(`
        <html>
          <body>
            <h1>Error: No se recibió el "code" en la URL.</h1>
          </body>
        </html>
      `)
    }

    // Verificamos si existe la tarjeta para mostrar algo al usuario
    const card = await LoyaltyCard.findBy('code', code)
    if (!card) {
      return response.send(`
        <html>
          <body>
            <h1>Error: Tarjeta no encontrada</h1>
          </body>
        </html>
      `)
    }

    // Retornamos un formulario muy básico que pide PIN
    return response.send(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Escanear Tarjeta</title>
        </head>
        <body>
          <h1>Tarjeta #${card.id} - ${card.customer_name || 'N/A'}</h1>
          <p>Introduce el PIN (en este caso, "user_id") para sumar una visita</p>

          <form action="/api/loyalty/do-scan" method="POST">
            <!-- Campo oculto con el code de la tarjeta -->
            <input type="hidden" name="code" value="${code}" />

            <label>PIN: <input type="password" name="pin" required /></label>
            <button type="submit">Agregar Visita</button>
          </form>
        </body>
      </html>
    `)
  }

  /**
   * POST /api/loyalty/do-scan
   * Compara "pin" con user.id (dueño del programa). Si coincide => +1 visita
   */
  public async doScan({ request, response }: HttpContext) {
    const code = request.input('code')
    const pinIngresado = request.input('pin')

    // Verificamos que existan ambos
    if (!code || !pinIngresado) {
      return response.send(`
        <html>
          <body>
            <h1>Error: faltan "code" o "pin"</h1>
            <a href="/api/loyalty/scan?code=${code}">Volver</a>
          </body>
        </html>
      `)
    }

    // 1. Cargar la tarjeta con su programa y "owner"
    const card = await LoyaltyCard.query()
      .where('code', code)
      .preload('program', (programQuery) => {
        programQuery.preload('owner') // "owner" es la relación con User
      })
      .first()

    if (!card) {
      return response.send('<h1>Tarjeta no encontrada</h1>')
    }

    // El user del programa
    const user = card.program.owner
    if (!user) {
      return response.send('<h1>Error: El programa no tiene un dueño (user) asociado</h1>')
    }

    // 2. Convertir pinIngresado a número y compararlo con user.id
    const pinComoNumero = Number.parseInt(pinIngresado, 10)
    if (pinComoNumero !== user.id) {
      return response.send(`
        <html>
          <body>
            <h1>PIN incorrecto</h1>
            <a href="/api/loyalty/scan?code=${code}">Intentar de nuevo</a>
          </body>
        </html>
      `)
    }

    // 3. Sumar la visita
    card.visits_count = (card.visits_count || 0) + 1

    // === Aquí agregas la misma lógica: ===
    if (card.program.type === 'visits') {
      const required = card.program.required_visits || 0
      if (card.visits_count >= required) {
        // Canje
        card.redemptions_count = (card.redemptions_count || 0) + 1
        // Reset
        card.visits_count = 0
        // (Opcional) reward_description
        const reward = card.program.reward_description || ''

        // Retornas un HTML que diga “Premio canjeado”.
        await card.save()
        return response.send(`
        <html>
          <body>
            <h1>¡Visita añadida y premio canjeado!</h1>
            <p>Tarjeta: ${card.code}</p>
            <p>El premio es: ${reward}</p>
          </body>
        </html>
      `)
      }
    }

    // Si no llegó a la meta, se guarda y se muestra el HTML normal
    await card.save()
    return response.send(`
    <html>
      <body>
        <h1>¡Visita añadida exitosamente!</h1>
        <p>Tarjeta: ${card.code}</p>
        <p>Visitas acumuladas: ${card.visits_count}</p>
      </body>
    </html>
  `)
  }
}

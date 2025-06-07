// app/Controllers/Http/LoyaltyQrController.ts
import type { HttpContext } from '@adonisjs/core/http'
import QRCode from 'qrcode'

export default class LoyaltyQrController {
  /**
   * Genera el QR en base64 para el code que le pasemos
   * GET o POST /api/loyalty/generate-qr
   */
  public async generateQr({ request, response }: HttpContext) {
    // Supongamos que el front envía "code" para identificar la tarjeta
    const { code } = request.only(['code'])

    if (!code) {
      return response.badRequest({ message: 'code is required' })
    }

    // La URL que contendrá el QR. Podría ser tu endpoint de escaneo
    // Ejemplo: /api/loyalty/scan?code=XYZ
    const url = `https://tu-dominio.com/api/loyalty/scan?code=${code}`

    try {
      // Generamos un string base64 con la imagen del QR
      const qrData = await QRCode.toDataURL(url)

      // Retornamos ese base64 para que en el front lo pongan en <img src={qrData} />
      return response.ok({ qr: qrData })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}

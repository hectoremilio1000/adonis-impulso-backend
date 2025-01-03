import DataTempTiktokAd from '#models/data_temp_tiktok_ad'
import type { HttpContext } from '@adonisjs/core/http'

export default class TestTiktokAdsController {
  async getCampaignsByCompanyId({ auth, params, response }: HttpContext) {
    await auth.check()
    const { companyId } = params
    console.log(companyId)
    try {
      // Obtener datos del usuario relacionados con Calendly
      const adsData = await DataTempTiktokAd.findManyBy('company_id', companyId)
      console.log(adsData)
      return {
        status: 'success',
        data: adsData,
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        status: 'error',
        message: 'Ocurrió un error al traer la data',
        error: error.message,
      })
    }

    const userId = auth?.user?.id
    console.log(userId)
  }
}

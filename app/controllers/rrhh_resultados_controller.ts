// file: app/Controllers/Http/RrhhResultadosController.ts

import RrhhRespuesta from '#models/rrhh_respuesta'
import RrhhResultado from '#models/rrhh_resultado'
import type { HttpContext } from '@adonisjs/core/http'

export default class RrhhResultadosController {
  // GET /api/rrhh/resultados => listar
  public async index({}: HttpContext) {
    try {
      // Listamos todos los resultados, ordenados por fecha desc
      const resultados = await RrhhResultado.query().orderBy('fecha', 'desc')
      return {
        status: 'success',
        data: resultados,
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error listing resultados',
        error: error.message,
      }
    }
  }

  /**
   * POST /api/rrhh/resultados/calcular
   *
   * Se recibe { candidatoId, intentoId, puesto }
   * 1) Buscamos las respuestas del candidato con ese intento
   * 2) Multiplicamos (peso_pregunta * peso_respuesta)
   * 3) Sumamos a la variable correspondiente según el examen.nombre (ej. Bondad, Optimismo, etc.)
   * 4) Clampeamos a 10 (opcional)
   * 5) Guardamos en rrhh_resultado
   */
  public async calcular({ request, response }: HttpContext) {
    try {
      const { candidatoId, intentoId, puesto } = request.only([
        'candidatoId',
        'intentoId',
        'puesto',
      ])

      // Validación mínima
      if (!candidatoId || !intentoId || !puesto) {
        return response.status(400).json({
          status: 'error',
          message: 'Faltan candidatoId, intentoId o puesto',
        })
      }

      // 1) Buscamos las respuestas
      const respuestas = await RrhhRespuesta.query()
        .where('candidato_id', candidatoId)
        .where('intento_id', intentoId)
        .preload('pregunta', (q) => {
          q.preload('examen')
        })

      if (respuestas.length === 0) {
        return response.status(404).json({
          status: 'error',
          message: 'No hay respuestas para ese candidato/intento',
        })
      }

      // 2) Inicializamos puntajes
      let puntajeBondad = 0
      let puntajeOptimismo = 0
      let puntajeEtica = 0
      let puntajeCuriosidad = 0
      let puntajeIntegridad = 0
      let puntajeAutoconciencia = 0
      let puntajeEmpatia = 0
      let puntajeConocimientos = 0

      // Examen IDs / versión
      let bondadExamId: number | null = null
      let bondadVersion: string | null = null

      let optimismoExamId: number | null = null
      let optimismoVersion: string | null = null

      let eticaExamId: number | null = null
      let eticaVersion: string | null = null

      let curiosidadExamId: number | null = null
      let curiosidadVersion: string | null = null

      let integridadExamId: number | null = null
      let integridadVersion: string | null = null

      let autoconcienciaExamId: number | null = null
      let autoconcienciaVersion: string | null = null

      let empatiaExamId: number | null = null
      let empatiaVersion: string | null = null

      let conocimientosExamId: number | null = null
      let conocimientosVersion: string | null = null

      // 3) Recorremos cada respuesta
      for (const r of respuestas) {
        const examen = r.pregunta.examen
        const nombreExamen = examen?.nombre || ''

        // Multiplicamos
        const calculo = (r.peso_pregunta || 0) * (r.peso_respuesta || 0)

        switch (nombreExamen) {
          case 'Bondad':
            puntajeBondad += calculo
            if (!bondadExamId) bondadExamId = examen?.id || null
            if (!bondadVersion && examen?.version) {
              bondadVersion = String(examen.version)
            }
            break

          case 'Optimismo':
            puntajeOptimismo += calculo
            if (!optimismoExamId) optimismoExamId = examen?.id || null
            if (!optimismoVersion && examen?.version) {
              optimismoVersion = String(examen.version)
            }
            break

          case 'Etica':
            puntajeEtica += calculo
            if (!eticaExamId) eticaExamId = examen?.id || null
            if (!eticaVersion && examen?.version) {
              eticaVersion = String(examen.version)
            }
            break

          case 'Curiosidad':
            puntajeCuriosidad += calculo
            if (!curiosidadExamId) curiosidadExamId = examen?.id || null
            if (!curiosidadVersion && examen?.version) {
              curiosidadVersion = String(examen.version)
            }
            break

          case 'Integridad':
            puntajeIntegridad += calculo
            if (!integridadExamId) integridadExamId = examen?.id || null
            if (!integridadVersion && examen?.version) {
              integridadVersion = String(examen.version)
            }
            break

          case 'Autoconciencia':
            puntajeAutoconciencia += calculo
            if (!autoconcienciaExamId) autoconcienciaExamId = examen?.id || null
            if (!autoconcienciaVersion && examen?.version) {
              autoconcienciaVersion = String(examen.version)
            }
            break

          case 'Empatia':
            puntajeEmpatia += calculo
            if (!empatiaExamId) empatiaExamId = examen?.id || null
            if (!empatiaVersion && examen?.version) {
              empatiaVersion = String(examen.version)
            }
            break

          default:
            // Asumimos que son "Conocimientos" del puesto
            if (nombreExamen === puesto) {
              puntajeConocimientos += calculo
              if (!conocimientosExamId) conocimientosExamId = examen?.id || null
              if (!conocimientosVersion && examen?.version) {
                conocimientosVersion = String(examen.version)
              }
            }
            break
        }
      }

      // 4) clamp a 10 (opcional)
      function clamp10(num: number): number {
        return Math.min(Math.max(num, 0), 10)
      }
      puntajeBondad = clamp10(puntajeBondad)
      puntajeOptimismo = clamp10(puntajeOptimismo)
      puntajeEtica = clamp10(puntajeEtica)
      puntajeCuriosidad = clamp10(puntajeCuriosidad)
      puntajeIntegridad = clamp10(puntajeIntegridad)
      puntajeAutoconciencia = clamp10(puntajeAutoconciencia)
      puntajeEmpatia = clamp10(puntajeEmpatia)
      puntajeConocimientos = clamp10(puntajeConocimientos)

      // 5) Guardar en RrhhResultado
      const nuevoRes = await RrhhResultado.create({
        candidato_id: candidatoId,
        intento_id: intentoId,
        puesto,
        puntaje_bondad: puntajeBondad,
        puntaje_optimismo: puntajeOptimismo,
        puntaje_etica: puntajeEtica,
        puntaje_curiosidad: puntajeCuriosidad,
        puntaje_integridad: puntajeIntegridad,
        puntaje_autoconciencia: puntajeAutoconciencia,
        puntaje_empatia: puntajeEmpatia,
        puntaje_conocimientos: puntajeConocimientos,
        // IDs y versiones
        bondad_examen_id: bondadExamId,
        bondad_version: bondadVersion,
        optimismo_examen_id: optimismoExamId,
        optimismo_version: optimismoVersion,
        etica_examen_id: eticaExamId,
        etica_version: eticaVersion,
        curiosidad_examen_id: curiosidadExamId,
        curiosidad_version: curiosidadVersion,
        integridad_examen_id: integridadExamId,
        integridad_version: integridadVersion,
        autoconciencia_examen_id: autoconcienciaExamId,
        autoconciencia_version: autoconcienciaVersion,
        empatia_examen_id: empatiaExamId,
        empatia_version: empatiaVersion,
        conocimientos_examen_id: conocimientosExamId,
        conocimientos_version: conocimientosVersion,
        // fecha se setea por default en la DB o en el modelo
      })

      return response.json({
        status: 'success',
        message: 'Resultados calculados y guardados',
        data: nuevoRes,
      })
    } catch (error) {
      console.error('Error calculando resultados =>', error)
      return response.status(500).json({
        status: 'error',
        message: error.message || 'Error interno al calcular resultados',
      })
    }
  }
}

import ResultCandidate from '#models/result_candidate'
import type { HttpContext } from '@adonisjs/core/http'
import AnswerCandidate from '#models/answer_candidate'

export default class ResultsCandidatesController {
  // Listar todos los answer candidates (GET /modules)
  public async index({}: HttpContext) {
    try {
      const results = await ResultCandidate.all()
      return {
        status: 'success',
        code: 200,
        message: 'Answer candidates fetched successfully',
        data: results,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching modules',
        error: error.message,
      }
    }
  }

  // Mostrar un answer individual por ID (GET /modules/:id)
  public async show({ params }: HttpContext) {
    try {
      const result = await ResultCandidate.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Module fetched successfully',
        data: result,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 404,
        message: 'Module not found',
        error: error.message,
      }
    }
  }

  // Mostrar un answer individual por ID (GET /modules/:id)
  public async getResultsCandidate({ params }: HttpContext) {
    try {
      const candidateId = params.candidateId
      const result = await ResultCandidate.query().where('candidateId', candidateId)
      return {
        status: 'success',
        code: 200,
        message: 'Module fetched successfully',
        data: result,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 404,
        message: 'Module not found',
        error: error.message,
      }
    }
  }

  // Función genérica para calcular puntajes

  public calcularPuntajePorExamen(
    respuestas: {
      exam_name: string
      answer_weight: number // Si en el modelo es string, conviértelo a number o cambia el tipo
      question_weight: number
      question_id: number
    }[],
    examenNombre: string
  ) {
    let puntaje = 0

    respuestas.forEach((respuesta) => {
      if (respuesta.exam_name === examenNombre) {
        // Asegúrate de que answer_weight sea number o conviértelo
        const calculo = Number(respuesta.answer_weight) * respuesta.question_weight
        puntaje += calculo

        console.log(
          `${examenNombre} -> Pregunta ID: ${respuesta.question_id}, Peso Respuesta: ${respuesta.answer_weight}, Peso Pregunta: ${respuesta.question_weight}, Puntaje Calculado: ${calculo}`
        )
      }
    })

    return Math.max(Math.min(puntaje, 10), 0.1)
  }

  // Crear el resultado
  public async store({ request }: HttpContext) {
    try {
      const data = request.only(['attempt', 'candidateId', 'puesto']) // Asume que estos campos existen
      const answers = await AnswerCandidate.query()
        .where('candidate_id', data.candidateId)
        .andWhere('attempt', data.attempt)

      const respuestasFormateadas = answers.map((answer) => ({
        exam_name: answer.exam_name,
        answer_weight: Number(answer.answer_weight), // convertir si es necesario
        question_weight: answer.question_weight,
        question_id: answer.question_id,
      }))

      // Inicializar resultados
      const resultados = {
        candidateId: Number(data.candidateId),
        puesto: String(data.puesto),
        puntajeBondad: 0,
        puntajeOptimismo: 0,
        puntajeEtica: 0,
        puntajeCuriosidad: 0,
        puntajeIntegridad: 0,
        puntajeAutoconciencia: 0,
        puntajeEmpatia: 0,
        puntajeConocimientos: 10,
      } as any
      const habilidadesPsicométricas = [
        'Bondad',
        'Optimismo',
        'Etica',
        'Curiosidad',
        'Integridad',
        'Autoconciencia',
        'Empatia',
      ]
      console.log('answers')
      console.log(answers)
      habilidadesPsicométricas.forEach((nombreExamen: string) => {
        const puntaje = this.calcularPuntajePorExamen(respuestasFormateadas, nombreExamen)
        resultados[`puntaje${nombreExamen}`] = puntaje

        const examen = answers.find((respuesta) => respuesta.exam_name === nombreExamen)

        if (examen) {
          resultados[`${nombreExamen.toLowerCase()}ExamenId`] = examen.id
          resultados[`${nombreExamen.toLowerCase()}Version`] = examen.exam_version
        } else {
          resultados[`${nombreExamen.toLowerCase()}ExamenId`] = null
          resultados[`${nombreExamen.toLowerCase()}Version`] = null
        }
      })

      console.log('Puntajes psicométricos calculados:', resultados)

      if (data) {
        const result = await ResultCandidate.create(resultados)
        return {
          status: 'success',
          code: 201,
          message: 'result created successfully',
          data: result,
        }
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error creating module',
        error: error.message,
      }
    }
  }
}

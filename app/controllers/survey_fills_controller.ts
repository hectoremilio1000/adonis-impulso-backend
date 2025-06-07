// file: app/Controllers/Http/SurveyFillController.ts

import Survey from '#models/survey'
import SurveyAnswer from '#models/survey_answer'
import SurveyResponse from '#models/survey_response'
import type { HttpContext } from '@adonisjs/core/http'

export default class SurveyFillController {
  /**
   * GET /api/surveys/fill?code=XYZ
   * Retorna un HTML con las preguntas
   */
  public async fill({ request, response }: HttpContext) {
    const code = request.input('code')
    if (!code) {
      return response.send('<h1>Error: falta el code en la URL</h1>')
    }

    // 1) Cargar la encuesta con sus preguntas
    const survey = await Survey.query().where('code', code).preload('questions').first()
    if (!survey) {
      return response.send('<h1>Encuesta no encontrada</h1>')
    }
    if (!survey.is_active) {
      // <-- Ajuste clave:
      //     si is_active = false/0, mostramos un aviso
      return response.send('<h1>Encuesta no activa</h1>')
    }

    // 2) Generar un formulario HTML básico
    let html = `<html><body><h1>Encuesta: ${survey.title}</h1>`
    html += `<form method="POST" action="/api/surveys/do-fill">`
    // Campo oculto con code
    html += `<input type="hidden" name="code" value="${survey.code}" />`

    // Campos “nombre” y “email”
    html += `<p>Tu nombre (opcional): <input type="text" name="customer_name" /></p>`
    html += `<p>Tu email (opcional): <input type="text" name="customer_email" /></p>`

    // 3) Por cada pregunta...
    survey.questions.forEach((q, index) => {
      html += `<div style="margin-bottom:8px;">`
      html += `<strong>${index + 1}. ${q.question_text}</strong><br/>`

      // === Dependiendo del tipo ===
      if (q.type === 'scale') {
        // Escala 1..10
        html += `<select name="answer_${q.id}">`
        for (let val = 1; val <= 10; val++) {
          html += `<option value="${val}">${val}</option>`
        }
        html += `</select>`
      } else if (q.type === 'multiple_choice') {
        // Radio con opciones
        const opts = q.options_json || []
        opts.forEach((opt: string, i2: number) => {
          html += `<label><input type="radio" name="answer_${q.id}" value="${i2}" /> ${opt}</label><br/>`
        })
      } else if (q.type === 'yesno') {
        // *** Sección NUEVA para “Sí/No” ***
        html += `
          <label><input type="radio" name="answer_${q.id}" value="yes" /> Sí</label><br/>
          <label><input type="radio" name="answer_${q.id}" value="no" /> No</label><br/>
        `
      } else {
        // text => caja de texto
        html += `<textarea name="answer_${q.id}" rows="2" cols="30"></textarea>`
      }

      html += `</div>`
    })

    // Botón de enviar
    html += `<button type="submit">Enviar Respuestas</button>`
    html += `</form></body></html>`

    return response.send(html)
  }

  /**
   * POST /api/surveys/do-fill
   * Procesa las respuestas del formulario
   */
  public async doFill({ request, response }: HttpContext) {
    const code = request.input('code')
    if (!code) {
      return response.send('<h1>Error: falta el code</h1>')
    }

    // 1) Buscar la encuesta
    const survey = await Survey.query().where('code', code).preload('questions').first()
    if (!survey) {
      return response.send('<h1>Encuesta no encontrada</h1>')
    }

    // (Opcional) Podrías también re-verificar si está activa:
    if (!survey.is_active) {
      return response.send('<h1>Encuesta no activa</h1>')
    }

    // 2) Crear SurveyResponse
    const sr = await SurveyResponse.create({
      survey_id: survey.id,
      customer_name: request.input('customer_name') || null,
      customer_email: request.input('customer_email') || null,
    })

    // 3) Por cada pregunta, crear un SurveyAnswer
    for (const question of survey.questions) {
      const fieldName = `answer_${question.id}`
      const rawValue = request.input(fieldName)

      // === Dependiendo del tipo de pregunta ===
      if (question.type === 'scale' || question.type === 'multiple_choice') {
        // Almacena como número (en answer_number)
        const num = Number.parseInt(rawValue, 10)
        if (!Number.isNaN(num)) {
          await SurveyAnswer.create({
            survey_response_id: sr.id,
            survey_question_id: question.id,
            answer_number: num,
          })
        }
      } else if (question.type === 'yesno') {
        // *** Sección NUEVA para “Sí/No” ***
        // “yes” o “no” como texto
        if (rawValue === 'yes' || rawValue === 'no') {
          await SurveyAnswer.create({
            survey_response_id: sr.id,
            survey_question_id: question.id,
            answer_text: rawValue, // guardamos la palabra "yes" o "no"
          })
        }
      } else {
        // text => se almacena en answer_text
        await SurveyAnswer.create({
          survey_response_id: sr.id,
          survey_question_id: question.id,
          answer_text: rawValue,
        })
      }
    }

    // 4) Devolvemos un HTML de agradecimiento
    return response.send(`
      <html>
        <body>
          <h1>¡Gracias por responder la encuesta!</h1>
          <p>Tu respuesta fue almacenada con éxito.</p>
        </body>
      </html>
    `)
  }
}

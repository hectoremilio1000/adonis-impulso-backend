import type { HttpContext } from '@adonisjs/core/http'

import Prospect from '#models/prospect'
import app from '@adonisjs/core/services/app'
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import OpenAI from 'openai'
import Recommendation from '#models/recommendation'
import Response from '#models/response' // <-- Asegúrate de que esté importado

export default class ProspectsController {
  public async index({}: HttpContext) {
    try {
      const prospects = await Prospect.all()
      return {
        status: 'success',
        code: 200,
        message: 'Prospects fetched succesfully',
        data: prospects,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching prospects',
        error: error.message,
      }
    }
  }

  public async show({ params }: HttpContext) {
    try {
      const prospect = await Prospect.findOrFail(params.id)
      return {
        status: 'success',
        code: 200,
        message: 'Operation successful',
        data: prospect,
      }
    } catch (error) {
      return {
        status: 'error',
        code: 500,
        message: 'An error occurred',
        error: error.message,
      }
    }
  }

  public async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'first_name',
        'last_name',
        'email',
        'whatsapp',
        'status',
        'origin',
      ])
      const prospect = await Prospect.create(data)

      return {
        status: 'success',
        code: 200,
        message: 'Operation successful',
        data: prospect,
      }
    } catch (error) {
      console.error(error)
      return {
        status: 'error',
        code: 500,
        message: 'An error occurred',
        error: error.message,
      }
    }
  }
  public async storeMeeting({ request }: HttpContext) {
    try {
      const data = request.only([
        'first_name',
        'last_name',
        'email',
        'whatsapp',
        'status',
        'origin',
      ])
      console.log('Datos recibidos:', data)

      const prospect = await Prospect.create(data)

      await mail.send((message) => {
        message
          .to(data.email)
          .from(env.get('SMTP_USERNAME'))
          .subject('Impulso Restaurantero: Nos pondremos en contacto pronto para el meeting')
          .html(
            `
            <html>
              <body>
                <h1>¡Gracias por tu interés en nuestros servicios!</h1>
                <p>Hola, ${data.first_name} ${data.last_name},</p>
                <p>
                  Hemos recibido tu solicitud y nos pondremos en contacto contigo para coordinar una reunión presencial o virtual y ayudarte a potenciar tu restaurante con nuestros servicios.
                </p>
                <p>¡Estamos emocionados de ayudarte!</p>
                <p>Atentamente,</p>
                <p>El equipo de Impulso Restaurantero</p>
              </body>
            </html>
          `
          )
      })

      return {
        status: 'success',
        code: 200,
        message: 'Prospecto creado y correo enviado exitosamente.',
        data: prospect,
      }
    } catch (error) {
      console.error('Error en storeMeeting:', error)
      return {
        status: 'error',
        code: 500,
        message: 'Error al crear el prospecto o enviar el correo.',
        error: error.message,
      }
    }
  }

  public async storeWithRecommendations({ request, response }: HttpContext) {
    try {
      // 1) Obtener datos del request
      const data = request.only([
        'first_name',
        'last_name',
        'email',
        'whatsapp',
        'status',
        'origin',
        'responses', // array de respuestas seleccionadas
      ])

      // 2) Crear el prospecto
      const prospect = await Prospect.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        whatsapp: data.whatsapp,
        status: data.status,
        origin: data.origin,
      })

      // 3) Asociar respuestas al prospecto (guardar en tabla 'responses')
      if (data.responses && Array.isArray(data.responses)) {
        const formattedResponses = data.responses.map((resp) => ({
          prospect_id: prospect.id,
          option_id: resp.option_id,
        }))

        await Response.createMany(formattedResponses)
        // 4) Construir el texto de las respuestas para OpenAI
        const respuestasTexto = data.responses
          .map((resp) => `Pregunta: ${resp.pregunta}\nRespuestas: ${resp.opciones.join(', ')}`)
          .join('\n\n')

        // 5) Generar recomendaciones (PROMPT EXTENSO)
        const openai = new OpenAI()
        const prompt = `
            Hola, ${data.first_name} ${data.last_name} soy un asistente especializado en negocios gastronómicos y estratégicos.
      
            Este es un resumen de las respuestas del usuario ${data.first_name}:
            ${respuestasTexto}
      
            Con base en estas respuestas, proporciona recomendaciones personalizadas y prácticas que incluyan:
            
            1. **Inspiración Visionaria:**
            - Ofrece ideas innovadoras basadas en ejemplos de líderes mundiales como Danny Meyer, René Redzepi, Howard Schultz, y Massimo Bottura dependiendo de las respuestas que hayan dado los usuarios y sobre el campo en acción que ellos te dirían dependiendo de donde está su mayor skill y de las preguntas y respuestas que respondieron, se muy particular como cada uno de ellos aportaría en cada cuestión dependiendo siempre de analizar las preguntas y respuestas ${respuestasTexto}.
            - Muestra cómo sus estrategias podrían aplicarse en el negocio dependiendo de ${respuestasTexto}.
      
            2. **Planificación Práctica dependiendo de ${respuestasTexto}:**
            - Detalla cómo estructurar un plan de trabajo para el primer año.
            - Incluye pasos específicos como investigación de mercado, definición de productos estrella, y estrategias iniciales de marketing siempre di cuáles y ejemplos prácticos dependiendo de su ${respuestasTexto} adaptándote.
      
            3. **Tecnología y Equipamiento Vanguardista dependiendo de ${respuestasTexto}:**
            - Recomienda las herramientas tecnológicas más recientes para optimizar procesos.
            - Sugiere equipo moderno que se alinee con el presupuesto mencionado.
      
            #### 4. Soporte Integral con "Impulso Restaurantero":
            - Explica cómo "Impulso Restaurantero" puede ayudar al usuario, basándote en ${respuestasTexto}.
            - Cada punto debe tener un mínimo de **300 palabras** y detallar cómo adaptamos nuestras soluciones a las respuestas proporcionadas. 
                  - Ayuda para saber cuáles son los requisitos legales para operar óptimamente tu restaurante.
                  - Estrategias de growth hacking y marketing digital modernas que te ayudaríamos a implementar con inteligencia artificial (di algunos ejemplos innovadores y cómo han impactado en TikTok, en Instagram y en Google Ads).  
                  - Inteligencia Artificial para análisis y decisiones (di cuestiones innovadoras y utiliza las últimas relevancias en el mercado para dar ejemplo que obtengas y habla cómo Impulso Restaurantero te ayudaría a generarlas en ti).
                  - Sistemas de punto de venta, reservas, y encuestas inteligentes (siempre di cuestiones innovadoras).
                  - Manuales y capacitación con IA (describe varios puntos de cómo te va a ayudar esto a tener un equipo de alto rendimiento para que tengas una operación sumamente estable).
                  - Creación de tu página web con sistema de calendario eficiente (di cómo lo vamos a crear con tecnología de punta para que siempre tengas el mejor ranking e indexación en Google, define estrategias innovadoras que utilizaríamos con tecnología como Next.js o sistemas modernos como Calendly y qué beneficios tiene).
                  - Inventarios inteligentes y monitoreo en tiempo real (cómo te ayudamos a tener mejores inventarios que se adapten a cómo organizas tus compras, etc).
                  - Financiamiento a tasas bajas (cómo te podríamos ayudar a financiar tu crecimiento, o máquinas para mejorar tu productividad, di algunas máquinas que te podríamos ayudar como hornos Rational o tipo de máquina de café que eleven la experiencia del cliente y cómo te ayudarían).
                  - Programas de lealtad para fidelizar clientes (ayudarte a generar algún programa de lealtad para que tengas clientes felices).
                  - Cómo te ayudaríamos a monitorear tu negocio para que no tengas robo hormiga, entre otras cuestiones.
      
            #### 5. Plan de Ejecución a Corto Plazo:
            - Diseña un plan de acción con objetivos claros para:
              - 15 días.
              - 1 mes.
              - 3 meses.
              - 6 meses.
              - 1 año.
            - Cada etapa debe incluir un mínimo de **200 palabras** con recomendaciones específicas, explicando cómo evaluar resultados y ajustar estrategias según las necesidades del usuario.
      
            - Termina con una frase inspiradora siempre diferente dependiendo de ${respuestasTexto} y explica cómo "Impulso Restaurantero" aplicará esa visión para apoyar al usuario.
      
            Asegúrate de que las recomendaciones sean detalladas, específicas y alineadas con las ${respuestasTexto}, evitando generalidades.
          `

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'Eres un asistente especializado en negocios gastronómicos y estratégicos que va a ayudar con impulso restaurantero a las personas para que crezcan su negocio.',
            },
            { role: 'user', content: prompt },
          ],
        })

        const recomendaciones =
          completion.choices[0]?.message?.content || 'No se pudieron generar recomendaciones.'

        // 6) Guardar las recomendaciones en la base
        const recommendation = await Recommendation.create({
          prospect_id: prospect.id,
          text: recomendaciones,
        })

        // 7) Enviar correo al usuario con las recomendaciones
        await mail.send((message) => {
          message
            .to(data.email)
            .from(env.get('SMTP_USERNAME'))
            .subject('Recomendaciones de Impulso Restaurantero').html(`
                <h1>¡Gracias por tus respuestas, ${data.first_name}!</h1>
                <p>Estas son nuestras recomendaciones personalizadas para tu restaurante:</p>
                <pre>${recomendaciones}</pre>
              `)
        })

        // 8) Respuesta final al cliente
        return response.status(200).json({
          status: 'success',
          message: 'Prospecto creado y recomendaciones enviadas exitosamente.',
          data: { prospect, recommendation },
        })
      }
    } catch (error) {
      console.error('Error en storeWithRecommendations:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Error al procesar la solicitud.',
        error: error.message,
      })
    }
  }
  public async storeWebSite({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'first_name',
        'last_name',
        'email',
        'whatsapp',
        'status',
        'origin',
      ])
      console.log('Datos recibidos:', data) // Verifica que `status` esté presente aquí

      // Crear el prospecto en la base de datos
      const prospect = await Prospect.create(data)

      // Ruta del PDF que será enviado como adjunto
      const pdfPath = app.makePath(
        'public/pdf/Estudio_de_3_Restaurantes_que_Triunfan_a_lo_Grande.pdf'
      )

      // Enviar el correo con el contenido directamente
      await mail.send((message) => {
        message
          .to(data.email) // Destinatario
          .from(env.get('SMTP_USERNAME')) // Remitente configurado en .env
          .subject('Impulso Restaurantero: Estudio de casos exitosos') // Asunto del correo
          .html(
            `
            <html>
              <body>
                <h1>¡Gracias por tu interés en nuestros estudios de casos exitosos!</h1>
                <p>Hola, ${data.first_name} ${data.last_name},</p>
                <p>
                  Adjuntamos un archivo PDF con el estudio de 33 restaurantes exitosos para que puedas inspirarte y lograr el éxito en tu negocio.
                </p>
                <p>¡Éxito!</p>
              </body>
            </html>
          `
          ) // Contenido del correo en formato HTML
          .attach(pdfPath, { filename: 'Estudio_de_3_Restaurantes_que_Triunfan_a_lo_Grande.pdf' }) // Adjunto
      })

      // Respuesta de éxito
      return response.created({
        status: 'success',
        message: 'Prospecto creado y correo enviado exitosamente.',
        data: prospect,
      })
    } catch (error) {
      console.error('Error en storeWebSite:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error al crear el prospecto o enviar el correo.',
        error: error.message,
      })
    }
  }
}

// file: config/bodyparser.ts
import { defineConfig } from '@adonisjs/core/bodyparser'

export default defineConfig({
  /**
   * Métodos HTTP donde el bodyparser se aplicará.
   * Dejar por defecto "POST, PUT, PATCH, DELETE" (o añade GET si lo deseas).
   */
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],

  /**
   * Ajustes para formularios URL-encoded
   */
  form: {
    convertEmptyStringsToNull: true,
    limit: '1mb',
  },

  /**
   * Ajustes para JSON
   */
  json: {
    convertEmptyStringsToNull: true,
    limit: '1mb',
    strict: true,
  },

  /**
   * Ajustes para multipart
   */
  multipart: {
    autoProcess: false,
    processManually: [],
    convertEmptyStringsToNull: true,
    fieldsLimit: '2mb', // Campos de texto
    limit: '20mb', // Límite total de archivos
    types: ['multipart/form-data'],
  },
  /**
   * Ajustes para raw text (si requieres)
   */
  raw: {
    limit: '1mb',
  },
})

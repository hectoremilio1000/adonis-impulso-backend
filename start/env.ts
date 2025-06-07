/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  MP_ACCESS_TOKEN: Env.schema.string(),
  MP_PUBLIC_KEY: Env.schema.string.optional(),
  APP_URL: Env.schema.string(),
  // CREDENTIALS GOOGLE ADS API
  CLIENT_ID: Env.schema.string(),
  CLIENT_SECRET: Env.schema.string(),
  DEVELOPER_TOKEN: Env.schema.string(),
  MANAGER_CUSTOMER_ID: Env.schema.string(),
  CUSTOMER_ID: Env.schema.string(),
  REDIRECT_URL: Env.schema.string(),
  REDIRECT_URL_FRONT: Env.schema.string(),
  // CREDENTIALS CALENDLY API
  CALENDLY_CLIENT_ID: Env.schema.string(),
  CALENDLY_CLIENT_SECRET: Env.schema.string(),
  CALENDLY_AUTH_BASE_URL: Env.schema.string(),
  CALENDLY_API_BASE_URL: Env.schema.string(),
  CALENDLY_REDIRECT_URI: Env.schema.string(),
  CALENDLY_BASE_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring the lock package
  |----------------------------------------------------------
  */
  LOCK_STORE: Env.schema.enum(['database', 'memory'] as const),
})

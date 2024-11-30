/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
import { middleware } from './kernel.js'

// const TestMailController = () => import('#controllers/test_mails_controller')

const ProspectsController = () => import('#controllers/prospects_controller')
const SectionsController = () => import('#controllers/sections_controller')
const PlansController = () => import('#controllers/plans_controller')
const RolesController = () => import('#controllers/roles_controller')
const ModulesController = () => import('#controllers/modules_controller')
const CompaniesController = () => import('#controllers/companies_controller')
const SedesController = () => import('#controllers/sedes_controller')
const SubscriptionsController = () => import('#controllers/subscriptions_controller')
const SuccesscasesController = () => import('#controllers/successcases_controller')
import TestMailsController from '#controllers/test_mails_controller'
import PaymentsController from '#controllers/payments_controller'
import OpeanaichatsController from '#controllers/opeanaichats_controller'
// import AuthController from '#controllers/auth_controller'

router.get('/api', async () => {
  return {
    hello: 'world',
  }
})
router.post('/api/register', [AuthController, 'register']).as('auth.register')
router.post('/api/newuser', [AuthController, 'createUser']).as('auth.createUser')
router.post('/api/login', [AuthController, 'login']).as('auth.login')
router.delete('/api/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
router.get('/api/me', [AuthController, 'me']).as('auth.me')

// RUTAS PARA companies
router.get('/api/companies', [CompaniesController, 'index']).as('company.index')
router.get('/api/companies/:id', [CompaniesController, 'show']).as('company.show')
router.post('/api/companies', [CompaniesController, 'store']).as('company.store')
router.put('/api/companies/:id', [CompaniesController, 'getSedes']).as('company.getSedes')
// router.delete('/api/companies/:id', [CompaniesController, 'destroy']).as('module.destroy')

// RUTAS PARA SEDES
router.get('/api/sedes', [SedesController, 'index']).as('sede.index')
router.get('/api/sedes/:id', [SedesController, 'show']).as('sede.show')
router.post('/api/sedes', [SedesController, 'store']).as('sede.store')
router.put('/api/sedes/:id', [SedesController, 'update']).as('sede.update')
router.delete('/api/sedes/:id', [SedesController, 'destroy']).as('sede.destroy')

// RUTAS PARA roles
router.get('/api/roles', [RolesController, 'index']).as('role.index')
router.get('/api/roles/:id', [RolesController, 'show']).as('role.show')
router.post('/api/roles', [RolesController, 'store']).as('role.store')
router.put('/api/roles/:id', [RolesController, 'update']).as('role.update')
router.delete('/api/roles/:id', [RolesController, 'destroy']).as('role.destroy')

// TEST DE MAIL
router.post('/api/testemail', [TestMailsController, 'index']).as('testmail.index')

// TESTS DE PAYMENTS MERCADO PAGO
router.post('/api/testpayment', [PaymentsController, 'store']).as('payment.store')
router
  .post('/api/testpayment/notifications', [PaymentsController, 'notification'])
  .as('payment.notification')
router
  .get('/api/testpayment/:type/:id', [PaymentsController, 'showSubscription'])
  .as('payment.showSubscription')

// RUTAS PARA SUBSCRIPTIONS
router.get('/api/subscriptions', [SubscriptionsController, 'index']).as('subscription.index')
router.get('/api/subscriptions/:id', [SubscriptionsController, 'show']).as('subscription.show')
router
  .get('/api/subscriptionbyuser/:id', [SubscriptionsController, 'subscriptionbyuser'])
  .as('subscription.subscriptionbyuser')
router.post('/api/subscriptions', [SubscriptionsController, 'store']).as('subscription.store')
router.put('/api/subscriptions/:id', [SubscriptionsController, 'update']).as('subscription.update')
router
  .delete('/api/subscriptions/:id', [SubscriptionsController, 'destroy'])
  .as('subscription.destroy')

// RUTAS PARA PLANES
router.get('/api/plans', [PlansController, 'index']).as('plan.index')
router.get('/api/plans/:id', [PlansController, 'show']).as('plan.show')
router.post('/api/plans', [PlansController, 'store']).as('plan.store')
router.put('/api/plans/:id', [PlansController, 'update']).as('plan.update')
router.delete('/api/plans/:id', [PlansController, 'destroy']).as('plan.destroy')

// RUTAS PARA modules de apps
router.get('/api/modules', [ModulesController, 'index']).as('module.index')
router.get('/api/modules/:id', [ModulesController, 'show']).as('module.show')
router.post('/api/modules', [ModulesController, 'store']).as('module.store')
router.put('/api/modules/:id', [ModulesController, 'update']).as('module.update')
router.delete('/api/modules/:id', [ModulesController, 'destroy']).as('module.destroy')

// RUTAS PARA CASOS DE ESTUDIO
router.get('/api/successcases', [SuccesscasesController, 'index']).as('successcases.index')
router.get('/api/successcases/:id', [SuccesscasesController, 'show']).as('successcases.show')
router.post('/api/successcases', [SuccesscasesController, 'store']).as('successcases.store')
// router.put('/api/successcases/:id', [SuccesscasesController, 'update']).as('successcases.update')
// router.delete('/api/successcases/:id', [SuccesscasesController, 'destroy']).as('plan.destroy')

// RUTAS PARA SECTIONS

router.post('/api/sections', [SectionsController, 'store']).as('sections.store')
// router.put('/api/successcases/:id', [SuccesscasesController, 'update']).as('successcases.update')
// router.delete('/api/successcases/:id', [SuccesscasesController, 'destroy']).as('plan.destroy')

//RUTA PARA RECIBIR LOS DATOS DE LOS PROSPECTS
router.post('/api/prospects', [ProspectsController, 'store']).as('prospect.store')
router.get('/api/prospects', [ProspectsController, 'index']).as('prospect.index')

// RUTA PARA OPENAI
router.post('api/chatgtp', [OpeanaichatsController, 'ask']).as('chatgtpask.ask')

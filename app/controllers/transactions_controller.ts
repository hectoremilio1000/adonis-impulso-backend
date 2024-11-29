import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  // Listar todos los subscripciones (GET /Transactions)
  public async index({}: HttpContext) {
    try {
      const transactions = await Transaction.query()

      return {
        status: 'success',
        code: 200,
        message: 'Modules fetched successfully',
        data: transactions,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching Transactions',
        error: error.message,
      }
    }
  }

  // Mostrar un Transaction individual por ID (GET /Transactions/:id)
  public async show({ params }: HttpContext) {
    console.log(params)
    const transaction = await Transaction.query().where('id', params.id).firstOrFail() // Cargar módulos relacionados
    return transaction
  }
  // Mostrar un plan individual por ID (GET /plans/:id)
  public async Transactionbysubscription({ params }: HttpContext) {
    try {
      const plan = await Transaction.query()
        .where('subscription_id', params.id)
        .preload('subscription')
        .firstOrFail()
      return {
        status: 'success',
        code: 200,
        message: 'Transaccion fetched successfully',
        data: plan,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error fetching Transaction',
        error: error.message,
      }
    }
  }

  // Crear un nuevo Transaction (POST /Transactions)
  public async store({ request }: HttpContext) {
    try {
      const data = request.only([
        'subscription_id',
        'method_payment',
        'status',
        'transaction_number',
        'amount',
        'payment_date',
      ]) // Asume que estos campos existen

      // Crear el Transaction
      const transaction = await Transaction.create({
        subscription_id: data.subscription_id,
        method_payment: data.method_payment,
        status: data.status,
        transaction_number: data.transaction_number,
        amount: data.amount,
        payment_date: data.payment_date,
      })

      return {
        status: 'success',
        code: 201,
        message: 'Transaction creado correctamente con módulos asociados',
        data: transaction,
      }
    } catch (error) {
      console.log(error)
      return {
        status: 'error',
        code: 500,
        message: 'Error creating Transaction',
        error: error.message,
      }
    }
  }

  // Actualizar un Transaction existente (PUT /Transactions/:id)
  public async update({ params, request }: HttpContext) {
    console.log(params)
    const transaction = await Transaction.findOrFail(params.id)
    const data = request.only([
      'subscription_id',
      'method_payment',
      'status',
      'transaction_number',
      'amount',
      'payment_date',
    ])
    transaction.merge(data)
    await transaction.save()
    return transaction
  }

  // Eliminar un Transaction (DELETE /Transactions/:id)
  public async destroy({ params }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)
    await transaction.delete()
    return { message: 'Transaction deleted successfully' }
  }
}

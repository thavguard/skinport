import { FastifyReply, FastifyRequest } from 'fastify'
import { db } from '../services/db.service'

export async function purchaseProduct(request: FastifyRequest, reply: FastifyReply) {
  const { userId, productId } = request.body as { userId: number, productId: number }
  try {
    await db.begin(async (client: any) => {
      const user = await client.one('SELECT * FROM users WHERE id = $1', [userId])
      const product = await client.one('SELECT * FROM products WHERE id = $1', [productId])
      if (user.balance < product.price) {
        throw new Error('Недостаточно средств')
      }
      const newBalance = user.balance - product.price
      await client.none('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId])
      await client.none('INSERT INTO purchases (user_id, product_id, price) VALUES ($1, $2, $3)', [userId, productId, product.price])
      return newBalance
    }).then((newBalance: number) => {
      reply.send({ newBalance })
    }).catch((err: Error) => {
      reply.status(400).send({ error: err.message })
    })
  } catch (error) {
    reply.status(500).send({ error: 'Ошибка при обработке запроса' })
  }
}

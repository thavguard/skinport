import { FastifyInstance } from 'fastify'
import { getSkinportPrices } from './controllers/skinport.controller'
import { purchaseProduct } from './controllers/purchase.controller'

export async function routes(fastify: FastifyInstance) {
  fastify.get('/min-prices', getSkinportPrices)
  fastify.post('/buy', purchaseProduct)
}

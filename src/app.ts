import Fastify from 'fastify'
import { routes } from './routes'
import { initDB } from './services/db.service'
import { initRedis } from './services/redis.service'

const fastify = Fastify({ logger: true })

initDB()
initRedis()

fastify.register(routes)

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log('Server listening on port 3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()

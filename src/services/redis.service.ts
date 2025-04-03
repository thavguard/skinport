import { createClient } from 'redis'
import { config } from '../config'

export const redisClient = createClient({
  url: `redis://${config.redisHost}:${config.redisPort}`
})

redisClient.on('error', (err) => console.error('Redis error', err))

export async function initRedis() {
  await redisClient.connect()
  console.log('Redis connected')
}

import postgres from 'postgres'
import { config } from '../config'

export const db = postgres({
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  username: config.dbUser,
  password: config.dbPassword
})

export function initDB() {
  console.log('DB connected')
}

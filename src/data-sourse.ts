import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { User, Blog, Comment } from './entities'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Blog, Comment],
})

export const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize()
    console.log('Database connection has been established successfully!')

    await AppDataSource.query('SELECT NOW()')
  } catch (error) {
    console.error('Data Source initialization error:', error)
    process.exit(1)
  }
}

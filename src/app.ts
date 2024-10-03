import express from 'express'
import type { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import { initializeDataSource } from './data-sourse'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3100

initializeDataSource()

app.get('/', (_: Request, res: Response) => {
  res.send('Hello, This is a blog management app!')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

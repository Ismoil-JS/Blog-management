import express from 'express'
import type { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import { initializeDataSource } from './data-sourse'
import { userRouter, blogRouter, commentRouter } from './modules/'

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 3100

initializeDataSource()

app.use(express.json())
app.use('/auth', userRouter)
app.use('/blog', blogRouter)
app.use(commentRouter)

app.get('/', (_: Request, res: Response) => {
  res.send('Hello, This is a blog management app!')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

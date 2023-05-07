import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import router from './routes'
import errorHandling from './middlewares/errorHandler'

dotenv.config()

const app: Express = express()
const port = Number(process.env.PORT) || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
// app.use(morgan('dev'))
app.use(router)
app.use(errorHandling)

app.listen(port, '0.0.0.0', () => {
  console.log(`⚡️Server is running at http://0.0.0.0:${port}`)
})

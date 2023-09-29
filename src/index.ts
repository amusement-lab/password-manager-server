import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import router from './routes'
import errorHandling from './middlewares/errorHandler'

dotenv.config()

const app: Express = express()
const port = Number(process.env.PORT) || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'LogRocket Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'LogRocket',
        url: 'https://logrocket.com',
        email: 'info@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

const specs = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))

app.use(router)
app.use(errorHandling)

app.listen(port, '0.0.0.0', () => {
  console.log(`⚡️Server is running at http://0.0.0.0:${port}`)
})

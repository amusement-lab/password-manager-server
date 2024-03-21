import { Router, Response, Request } from 'express'
import swaggerUi from 'swagger-ui-express'
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'

import passwordRoute from './passwordRoutes'
import userRoute from './userRoutes'
import { registry } from '../helpers/zod'

const router = Router()

const generator = new OpenApiGeneratorV31(registry.definitions)
const openApiDocs = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    version: '1.2.1',
    title: 'Password API',
    description: 'API documentation for Password Manager Apps',
  },
  servers: [{ url: 'http://localhost:3000' }],
})

router.get('/', (_: Request, res: Response) => {
  res.status(200).json({ message: 'Server connected' })
})

router.use('/open-api', swaggerUi.serve)
router.get('/open-api', swaggerUi.setup(openApiDocs))
router.get('/open-api-json', (_: Request, res: Response) => {
  return res.json(openApiDocs)
})

router.use(userRoute)
router.use(passwordRoute)

export default router

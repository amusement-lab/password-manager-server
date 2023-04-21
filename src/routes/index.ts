import { Router, Response, Request } from 'express'
import passwordRoute from './passwordRoutes'
import userRoute from './userRoutes'

const router = Router()

router.get('/', (_: Request, res: Response) => {
  res.status(200).json({ message: 'Server connected' })
})

router.use(userRoute)
router.use(passwordRoute)

export default router

import { Router } from 'express'
import { authentication } from '../middlewares/auth.ts'
import UserController from '../controllers/userController.ts'
import KeyController from '../controllers/keyController.ts'

const router: Router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use(authentication)
router.post('/change-key', KeyController.changeKey)

export default router

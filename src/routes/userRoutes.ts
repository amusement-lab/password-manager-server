import { Router } from 'express'
import { authentication } from '../middlewares/auth'
import UserController from '../controllers/userController'
import KeyController from '../controllers/keyController'

const router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use(authentication)
router.post('/change-password', KeyController.changeKey)

export default router

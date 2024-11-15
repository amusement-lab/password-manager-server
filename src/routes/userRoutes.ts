import { Router } from 'express'
import { authentication } from '../middlewares/auth'
import UserController from '../controllers/userController'
import KeyController from '../controllers/keyController'

const router: Router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.use(authentication)
router.post('/change-key', KeyController.changeKey)

export default router

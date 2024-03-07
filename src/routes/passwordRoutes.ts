import { Router } from 'express'
import PasswordController from '../controllers/passwordController'
import { authentication } from '../middlewares/auth'

const router = Router()
router.use(authentication)
router.get('/password', PasswordController.getPassword)
router.post('/password', PasswordController.addPassword)
router.get('/password/:id', PasswordController.detailPassword)
router.put('/password/:id', PasswordController.editPassword)
router.delete('/password/:id', PasswordController.deletePassword)

export default router

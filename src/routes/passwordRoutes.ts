import { Router } from 'express'
import PasswordController from '../controllers/passwordController'
import { authentication, passwordAuthorization } from '../middlewares/auth'

const router = Router()
router.use(authentication)
router.get('/password', PasswordController.getPassword)
router.post('/password', PasswordController.addPassword)
router.get('/password/:id', passwordAuthorization, PasswordController.detailPassword)
router.put('/password/:id', passwordAuthorization, PasswordController.editPassword)
router.delete('/password/:id', passwordAuthorization, PasswordController.deletePassword)

export default router

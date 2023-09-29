import { Router } from 'express'
import { authentication } from '../middlewares/auth'
import UserController from '../controllers/userController'
import KeyController from '../controllers/keyController'

const router = Router()

router.post('/register', UserController.register)
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /bookss:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */
router.post('/login', UserController.login)
router.use(authentication)
router.post('/change-password', KeyController.changeKey)

export default router

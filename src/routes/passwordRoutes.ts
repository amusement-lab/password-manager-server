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

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /booksss:
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

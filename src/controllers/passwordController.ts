import { NextFunction, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RequestWithLoggedUser } from '../entities/user.entity'
import { encrypt, decrypt } from '../helpers/ciphers'

const prisma = new PrismaClient()

class Password {
  static async getPassword(req: RequestWithLoggedUser, res: Response) {
    const passwordResponse = await prisma.password.findMany({
      where: {
        userId: req.loggedUser?.id,
      },
    })

    const passwordData = passwordResponse.map((password) => {
      return {
        id: password.id,
        title: decrypt(password.title, req.body.key),
        username: decrypt(password.username, req.body.key),
      }
    })

    res.status(200).json(passwordData)
  }

  static async detailPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const data = await prisma.password.findUnique({
        where: { id },
      })
      if (data) {
        res.status(200).json({
          ...data,
          title: decrypt(data.title, req.body.key),
          username: decrypt(data.username, req.body.key),
          password: decrypt(data.password, req.body.key),
        })
      }
    } catch (err) {
      next(err)
    }
  }

  static async addPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { title, password, username, key } = req.body
      await prisma.password.create({
        data: {
          title: encrypt(title, key),
          username: encrypt(username, key),
          password: encrypt(password, key),
          userId: req.loggedUser!.id,
        },
      })
      res.status(200).json({ message: 'Password added successfully' })
    } catch (err) {
      next(err)
    }
  }

  static async editPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { title, username, password, key } = req.body
      const { id } = req.params

      await prisma.password.update({
        where: { id },
        data: {
          title: encrypt(title, key),
          username: encrypt(username, key),
          password: encrypt(password, key),
        },
      })

      res.status(200).json({ message: 'Password updated successfully' })
    } catch (err) {
      next(err)
    }
  }

  static async deletePassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      await prisma.password.delete({
        where: { id },
      })

      res.status(200).json({ message: 'Password deleted successfully' })
    } catch (err) {
      next(err)
    }
  }
}

export default Password

import { NextFunction, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RequestWithLoggedUser } from '../entities/user.entity'
import { dec, enc } from '../helpers/ciphers'

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
        title: dec(password.title, req.loggedUser!.key),
        username: dec(password.username, req.loggedUser!.key),
      }
    })
    res.status(200).json(passwordData)
  }

  static async detailPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const data = await prisma.password.findFirst({
        where: { id },
      })
      if (data) {
        res.status(200).json({
          ...data,
          title: dec(data.title, req.loggedUser!.key),
          username: dec(data.username, req.loggedUser!.key),
          password: dec(data.password, req.loggedUser!.key),
        })
      } else {
        throw { statusCode: 404, message: 'Data not found' }
      }
    } catch (err) {
      next(err)
    }
  }

  static async addPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { title, password, username } = req.body
      await prisma.password.create({
        data: {
          title: enc(title, req.loggedUser!.key),
          username: enc(username, req.loggedUser!.key),
          password: enc(password, req.loggedUser!.key),
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
      const { title, password } = req.body
      const { id } = req.params

      const response = await prisma.password.update({
        where: { id },
        data: {
          title,
          password: enc(password, req.loggedUser!.key),
        },
      })

      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }

  static async deletePassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const response = await prisma.password.delete({
        where: { id },
      })

      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
}

export default Password

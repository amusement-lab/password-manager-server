import { NextFunction, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { RequestWithLoggedUser } from '../entities/user.entity'
import {
  GetPasswordsSchema,
  PasswordSchema,
  UpsertPasswordSchema,
} from '../entities/password.entity'
import { encrypt, decrypt } from '../helpers/ciphers'

const prisma = new PrismaClient()

class Password {
  static async getPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const key = req.loggedUser!.hashedKey

      const passwordResponse = await prisma.vault.findUniqueOrThrow({
        where: {
          userId: req.loggedUser!.id,
        },
        include: {
          password: true,
        },
      })

      const passwordData = passwordResponse.password.map((password) => {
        return {
          id: password.id,
          title: decrypt(password.title, key),
          username: decrypt(password.username, key),
          url: password.url ? decrypt(password.url, key) : '',
        }
      })

      res.status(200).json(GetPasswordsSchema.parse(passwordData))
    } catch (err) {
      next(err)
    }
  }

  static async detailPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const key = req.loggedUser!.hashedKey

      const data = await prisma.password.findUnique({
        where: { id },
      })

      if (data) {
        res.status(200).json(
          PasswordSchema.parse({
            ...data,
            title: decrypt(data.title, key),
            username: decrypt(data.username, key),
            password: decrypt(data.password, key),
            url: data.url ? decrypt(data.url, key) : null,
          })
        )
      }
    } catch (err) {
      next(err)
    }
  }

  static async addPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { title, password, username, url } = UpsertPasswordSchema.parse(req.body)
      const key = req.loggedUser!.hashedKey

      const vault = await prisma.vault.findUniqueOrThrow({
        where: {
          userId: req.loggedUser!.id,
        },
        select: {
          id: true,
        },
      })

      await prisma.password.create({
        data: {
          title: encrypt(title, key),
          username: encrypt(username, key),
          password: encrypt(password, key),
          url: url ? encrypt(url, key) : null,
          vaultId: vault.id,
        },
      })
      res.status(200).json({ message: 'Password added successfully' })
    } catch (err) {
      next(err)
    }
  }

  static async editPassword(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { title, password, username, url } = UpsertPasswordSchema.parse(req.body)
      const { id } = req.params
      const key = req.loggedUser!.hashedKey

      await prisma.password.update({
        where: { id },
        data: {
          title: encrypt(title, key),
          username: encrypt(username, key),
          password: encrypt(password, key),
          url: url ? encrypt(url, key) : null,
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

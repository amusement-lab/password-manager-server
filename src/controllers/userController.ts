import { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { generateHash, verifyHash, generateSimpleHash } from '../helpers/hash'
import { generateToken } from '../helpers/jwt'
import { LoggedUser, LoginUserSchema, UserSchema } from '../entities/user.entity'

const prisma = new PrismaClient()

class User {
  static async getUser(_: Request, res: Response) {
    const usersData = await prisma.user.findMany()
    res.status(200).json(usersData)
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, key, name } = UserSchema.parse(req.body)

      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          key: await generateHash(key),
        },
      })

      // Once user successfully registered, automatically created with a vault by default
      await prisma.vault.create({
        data: {
          userId: newUser.id,
        },
      })

      res.status(201).json({ message: 'Register success' })
    } catch (err) {
      next(err)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, key } = LoginUserSchema.parse(req.body)

      const data = await prisma.user.findUnique({
        where: { username },
      })

      if (data) {
        const valid = await verifyHash(data.key, key)
        if (valid) {
          const loggedUser: LoggedUser = {
            id: data.id,
            username: data.username,
            hashedKey: generateSimpleHash(key),
          }
          res.status(200).json({ token: generateToken(loggedUser) })
        } else {
          throw { statusCode: 400, message: 'Credential error' }
        }
      } else {
        throw { statusCode: 404, message: 'Username not registered' }
      }
    } catch (err) {
      next(err)
    }
  }
}

export default User

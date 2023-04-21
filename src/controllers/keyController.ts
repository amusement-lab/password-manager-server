import { NextFunction, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RequestWithLoggedUser } from '../entities/user.entity'
import { dec, enc } from '../helpers/ciphers'
import { hash, verify } from '../helpers/hash'
const prisma = new PrismaClient()

class KeyController {
  static async changeKey(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { oldKey, newKey } = req.body

      const foundUser = await prisma.user.findUnique({ where: { id: req.loggedUser?.id } })

      if (foundUser) {
        const valid = await verify(foundUser.key, oldKey)

        if (valid) {
          await prisma.user.update({
            where: { id: req.loggedUser?.id },
            data: {
              key: await hash(newKey),
            },
          })

          const allUserPassDatas = await prisma.password.findMany({
            where: { userId: req.loggedUser?.id },
          })

          allUserPassDatas.forEach(async (data) => {
            const tempPassword = dec(data.password, oldKey)
            await prisma.password.update({
              where: {
                id: data.id,
              },
              data: {
                password: enc(tempPassword, newKey),
              },
            })
          })

          res.status(200).json({ message: 'Key updated' })
        } else {
          throw { statusCode: 400, message: 'Credential invalid' }
        }
      } else {
        throw { statusCode: 404, message: 'User not found' }
      }
    } catch (err) {
      next(err)
    }
  }
}

export default KeyController

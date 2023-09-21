import { NextFunction, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RequestWithLoggedUser } from '../entities/user.entity'
import { encrypt, decrypt } from '../helpers/ciphers'
import { generateHash, verifyHash } from '../helpers/hash'
const prisma = new PrismaClient()

class KeyController {
  static async changeKey(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { oldKey, newKey } = req.body

      const foundUser = await prisma.user.findUnique({ where: { id: req.loggedUser?.id } })

      if (foundUser) {
        const valid = await verifyHash(foundUser.key, oldKey)

        if (valid) {
          return await prisma.$transaction(async (tx) => {
            await tx.user.update({
              where: { id: req.loggedUser?.id },
              data: {
                key: await generateHash(newKey),
              },
            })

            const allUserPassDatas = await tx.password.findMany({
              where: { userId: req.loggedUser?.id },
            })

            allUserPassDatas.forEach(async (data) => {
              const currentPassword = decrypt(data.password, oldKey)
              await tx.password.update({
                where: {
                  id: data.id,
                },
                data: {
                  password: encrypt(currentPassword, newKey),
                },
              })
            })

            res.status(200).json({ message: 'Key updated' })
          })
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

import { NextFunction, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { ChangeKeySchema, RequestWithLoggedUser } from '../entities/user.entity'
import { encrypt, decrypt } from '../helpers/ciphers'
import { generateHash, generateSimpleHash, verifyHash } from '../helpers/hash'

const prisma = new PrismaClient()

class KeyController {
  static async changeKey(req: RequestWithLoggedUser, res: Response, next: NextFunction) {
    try {
      const { rawOldKey, rawNewKey } = ChangeKeySchema.parse(req.body)
      const oldKey = generateSimpleHash(rawOldKey)
      const newKey = generateSimpleHash(rawNewKey)

      const foundUser = await prisma.user.findUnique({ where: { id: req.loggedUser?.id } })

      if (foundUser) {
        const valid = await verifyHash(foundUser.key, rawOldKey)

        if (valid) {
          return await prisma.$transaction(async (tx) => {
            await tx.user.update({
              where: { id: req.loggedUser?.id },
              data: {
                key: await generateHash(rawNewKey),
              },
            })

            const allUser = await tx.vault.findUniqueOrThrow({
              where: { userId: req.loggedUser?.id },
              include: { password: true },
            })

            // Password data, please check prisma in Password Model in schema
            for (let i = 0; i < allUser.password.length; i++) {
              const currentDecryptedPassData = {
                title: decrypt(allUser.password[i].title, oldKey),
                url: allUser.password[i].url ? decrypt(allUser.password[i].url!, oldKey) : null,
                username: decrypt(allUser.password[i].username, oldKey),
                password: decrypt(allUser.password[i].password, oldKey),
              }

              await tx.password.update({
                where: {
                  id: allUser.password[i].id,
                },
                data: {
                  title: encrypt(currentDecryptedPassData.title, newKey),
                  url: currentDecryptedPassData.url
                    ? encrypt(currentDecryptedPassData.url, newKey)
                    : null,
                  username: encrypt(currentDecryptedPassData.username, newKey),
                  password: encrypt(currentDecryptedPassData.password, newKey),
                },
              })
            }

            res
              .status(200)
              .json({ message: 'Key updated, please logout and login again with new key' })
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

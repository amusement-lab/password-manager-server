// Resource for this code
// https://fireship.io/lessons/node-crypto-examples
// https://sl.bing.net/fVIcrPcSk1I

import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto'

const iv = randomBytes(16)

function simpleHash(str: string): string {
  return createHash('sha256').update(String(str)).digest('hex').substring(0, 32)
}

function encrypt(payload: string, secret: string) {
  const cipher = createCipheriv('aes256', simpleHash(secret), iv)
  return cipher.update(payload, 'utf8', 'hex') + cipher.final('hex')
}

function decrypt(encryptedMessage: string, secret: string) {
  const decipher = createDecipheriv('aes256', simpleHash(secret), iv)
  return decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf8')
}

export { encrypt, decrypt }

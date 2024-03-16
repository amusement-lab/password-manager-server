// Resource for this code
// https://fireship.io/lessons/node-crypto-examples
// https://sl.bing.net/fVIcrPcSk1I
// https://stackoverflow.com/questions/74177757/iam-getting-bad-decrypt-error-in-node-js

import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto'

function simpleHash(str: string): string {
  return createHash('sha256').update(String(str)).digest('hex').substring(0, 32)
}

function encrypt(payload: string, secret: string) {
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes256', simpleHash(secret), iv)

  // Store the iv into the end of chipher string, divide by comma, and convert it to base64
  return `${cipher.update(payload, 'utf8', 'hex')}${cipher.final('hex')},${iv.toString('base64')}`
}

function decrypt(encryptedMessage: string, secret: string) {
  // Get the iv by splitting the string by comma and converting it to buffer
  const splitEncryptedMessage = encryptedMessage.split(',')
  const iv = Buffer.from(splitEncryptedMessage[1], 'base64')
  const decipher = createDecipheriv('aes256', simpleHash(secret), iv)
  return `${decipher.update(splitEncryptedMessage[0], 'hex', 'utf8')}${decipher.final('utf8')}`
}

export { encrypt, decrypt }

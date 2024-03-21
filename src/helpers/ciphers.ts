// Resource for this code
// https://fireship.io/lessons/node-crypto-examples
// https://sl.bing.net/fVIcrPcSk1I
// https://stackoverflow.com/questions/74177757/iam-getting-bad-decrypt-error-in-node-js

/*
 * The `secret` must be 32 bytes long, because `aes256` algorithm requires it.
 * But, we cannot forced user to use 32 characters for key.
 * So, we must convert the raw key into 32 bytes long secret.
 * The convert proses has been done in login process at generate jwt token
 * Please check the login process for more detail about this
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export function encrypt(payload: string, secret: string) {
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes256', secret, iv)

  // Store the iv into the end of chipher string, divide by comma, and convert it to base64
  return `${cipher.update(payload, 'utf8', 'hex')}${cipher.final('hex')},${iv.toString('base64')}`
}

export function decrypt(encryptedMessage: string, secret: string) {
  // Get the iv by splitting the string by comma and converting it to buffer
  const splitEncryptedMessage = encryptedMessage.split(',')
  const iv = Buffer.from(splitEncryptedMessage[1], 'base64')
  const decipher = createDecipheriv('aes256', secret, iv)
  return `${decipher.update(splitEncryptedMessage[0], 'hex', 'utf8')}${decipher.final('utf8')}`
}

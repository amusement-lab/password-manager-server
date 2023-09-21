import * as argon2 from 'argon2'

async function generateHash(key: string) {
  return await argon2.hash(key)
}

async function verifyHash(hash: string, key: string) {
  return await argon2.verify(hash, key)
}

export { generateHash, verifyHash }

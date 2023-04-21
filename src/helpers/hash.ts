import * as argon2 from 'argon2'

async function hash(key: string) {
  return await argon2.hash(key)
}

async function verify(hash: string, key: string) {
  return await argon2.verify(hash, key)
}

export { hash, verify }

import argon2 from '@node-rs/argon2'
import { createHash } from 'crypto'

export async function generateHash(key: string) {
  return await argon2.hash(key)
}

export async function verifyHash(hash: string, key: string) {
  return await argon2.verify(hash, key)
}

export function generateSimpleHash(str: string): string {
  return createHash('sha256').update(String(str)).digest('hex').substring(0, 32)
}

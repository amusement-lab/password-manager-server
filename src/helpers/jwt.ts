import jwt from 'jsonwebtoken'
import { LoggedUser } from '../entities/user.entity'

const secret = process.env.JWT_SECRET as string

function generateToken(payload: LoggedUser) {
  return jwt.sign(payload, secret)
}

function decodeToken(token: string) {
  return jwt.verify(token, secret)
}

export { decodeToken, generateToken }

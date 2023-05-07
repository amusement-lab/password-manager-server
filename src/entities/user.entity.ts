import { Request } from 'express'

export interface LoggedUser {
  username: string
  id: string
  key: string
}

export interface RequestWithLoggedUser extends Request {
  loggedUser?: LoggedUser
}

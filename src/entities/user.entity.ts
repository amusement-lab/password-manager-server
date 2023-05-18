import { Request } from 'express'

export interface LoggedUser {
  username: string
  id: string
}

export interface RequestWithLoggedUser extends Request {
  loggedUser?: LoggedUser
}

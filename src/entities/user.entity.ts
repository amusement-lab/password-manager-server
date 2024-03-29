import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { Request } from 'express'
import { z } from 'zod'

import { registry } from '../helpers/zod'

export interface LoggedUser {
  username: string
  id: string
  hashedKey: string
}

export interface RequestWithLoggedUser extends Request {
  loggedUser?: LoggedUser
}

extendZodWithOpenApi(z)

export const UserSchema = registry.register(
  'User',
  z.object({
    name: z.string(),
    username: z.string(),
    key: z.string().min(8, { message: 'Key/Password must be 8 or more characters long' }),
  })
)

export const LoginUserSchema = registry.register('LoginUser', UserSchema.omit({ name: true }))

export const ChangeKeySchema = registry.register(
  'ChangeKey',
  z.object({
    rawOldKey: z.string(),
    rawNewKey: z.string().min(8, { message: 'Key/Password must be 8 or more characters long' }),
  })
)

// register
registry.registerPath({
  method: 'post',
  path: '/register',
  description: 'Register user',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Object with message data',
      content: {
        'application/json': {
          schema: z.object({ token: z.string() }),
        },
      },
    },
  },
})

// login
registry.registerPath({
  method: 'post',
  path: '/login',
  description: 'Login user',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Object with token data',
      content: {
        'application/json': {
          schema: z.object({ token: z.string() }),
        },
      },
    },
  },
})

// change key
registry.registerPath({
  method: 'post',
  path: '/change-key',
  description: 'Change key/password for open the vault',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChangeKeySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Object with message data',
      content: {
        'application/json': {
          schema: z.object({ token: z.string() }),
        },
      },
    },
  },
})

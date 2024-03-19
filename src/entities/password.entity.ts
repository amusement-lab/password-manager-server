import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { registry } from '../helpers/zod'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const PasswordSchema = registry.register(
  'Password',
  z.object({
    id: z.string(),
    createdAt: z.coerce.string(),
    updatedAt: z.coerce.string(),
    title: z.string(),
    username: z.string(),
    password: z.string(),
    url: z.string(),
  })
)

export const GetPasswordsSchema = registry.register(
  'GetPasswords',
  z.array(
    PasswordSchema.omit({
      createdAt: true,
      updatedAt: true,
      password: true,
      url: true,
    })
  )
)

export const UpsertPasswordSchema = registry.register(
  'UpsertPassword',
  PasswordSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
    key: z.string(),
  })
)

// getPassword
registry.registerPath({
  method: 'get',
  path: '/password',
  description: 'Get all user password data',
  responses: {
    200: {
      description: 'Array with password data.',
      content: {
        'application/json': {
          schema: z.array(GetPasswordsSchema),
        },
      },
    },
  },
})

// detailPassword
registry.registerPath({
  method: 'get',
  path: '/password/:id',
  description: 'Get one user password data by id',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Object with password data.',
      content: {
        'application/json': {
          schema: PasswordSchema,
        },
      },
    },
  },
})

// addPassword
registry.registerPath({
  method: 'post',
  path: '/password',
  description: 'Create one new password data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpsertPasswordSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Object with message data.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
})

// editPassword
registry.registerPath({
  method: 'put',
  path: '/password/:id',
  description: 'Edit one password data by id',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: UpsertPasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Object with message data.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
})

// deletePassword
registry.registerPath({
  method: 'delete',
  path: '/password/:id',
  description: 'Delete one password data by id',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Object with message data.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
})

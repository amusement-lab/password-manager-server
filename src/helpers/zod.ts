import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

export const registry = new OpenAPIRegistry()

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'Bearer',
  bearerFormat: 'JWT',
  in: 'header',
})

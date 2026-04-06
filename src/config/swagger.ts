import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
export const registry = new OpenAPIRegistry();

// Register the schemas
export const userSchema = registry.register('User', z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6), // Password will need hashing later
  age: z.number().int().optional(),
  weight: z.number().optional(),
  goal: z.string().optional()
}));

export const waterLogSchema = registry.register('WaterLog', z.object({
  userId: z.string().length(24, 'ID de usuário inválido (precisa ser um ObjectId do Mongo)').openapi({ example: '6612d32ba9f13d8d64111f11' }),
  amountMl: z.number().int().positive('A quantidade de água deve ser positiva').openapi({ example: 250 }),
  loggedAt: z.string().datetime().optional().openapi({ example: '2026-04-06T16:15:00Z' })
}));

// Register the paths
registry.registerPath({
  method: 'post',
  path: '/api/users',
  description: 'Create a new user',
  summary: 'Create User',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
    },
    400: {
      description: 'Invalid request data',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  description: 'Get user by ID',
  summary: 'Get User',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'User ID' })
    })
  },
  responses: {
    200: {
      description: 'User details',
    },
    404: {
      description: 'User not found',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/water/intake',
  description: 'Log water intake for a user',
  summary: 'Log Water',
  request: {
    body: {
      content: {
        'application/json': {
          schema: waterLogSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Water intake logged successfully',
    },
    400: {
      description: 'Invalid request data',
    },
  },
});

export function generateOpenAPI() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Diet App API',
      description: 'API for Diet App - Projeto Integrador',
    },
    servers: [{ url: 'http://localhost:3000' }],
  });
}

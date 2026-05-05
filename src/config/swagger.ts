import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
export const registry = new OpenAPIRegistry();

export const userSchema = registry.register('User', z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  age: z.number().int().optional(),
  weight: z.number().optional(),
  goal: z.string().optional(),
  status: z.enum(['Ativo', 'Inativo']).optional(),
  lastVisit: z.string().optional(),
  compliance: z.number().min(0).max(100).optional(),
  macroTargets: z.object({
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
  }).optional(),
  waterGoal: z.number().min(0).optional(),
}));

export const waterLogSchema = registry.register('WaterLog', z.object({
  userId: z.string().length(24, 'ID de usuário inválido (precisa ser um ObjectId do Mongo)').openapi({ example: '6612d32ba9f13d8d64111f11' }),
  amountMl: z.number().int().positive('A quantidade de água deve ser positiva').openapi({ example: 250 }),
  loggedAt: z.string().datetime().optional().openapi({ example: '2026-04-06T16:15:00Z' })
}));

export const waterLogRequestSchema = registry.register('WaterLogRequest', z.object({
  userId: z.string().length(24, 'ID de usuário inválido (precisa ser um ObjectId do Mongo)').openapi({ example: '6612d32ba9f13d8d64111f11' }),
  amount: z.number().int().positive('A quantidade de água deve ser positiva').openapi({ example: 250 }),
  date: z.string().openapi({ description: 'Data do registro', example: '2023-10-25' })
}));

export const waterLogResponseSchema = registry.register('WaterLogResponse', z.object({
  amount: z.number().int().positive().openapi({ example: 250 })
}));

registry.registerPath({
  method: 'post',
  path: '/api/users',
  description: 'Create a new patient',
  summary: 'Create Patient',
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
    201: { description: 'Patient created successfully' },
    400: { description: 'Invalid request data' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users',
  description: 'List all patients with their latest daily log',
  summary: 'List Patients',
  responses: {
    200: { description: 'List of patients' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  description: 'Get patient by ID',
  summary: 'Get Patient',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'Patient ID' })
    })
  },
  responses: {
    200: { description: 'Patient details' },
    404: { description: 'Patient not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/water/patient/{id}',
  description: 'Get latest daily log for a patient',
  summary: 'Get Latest Daily Log',
  request: {
    params: z.object({
      id: z.string().openapi({ description: 'Patient ID' })
    })
  },
  responses: {
    200: { description: 'Latest daily log' },
    404: { description: 'No log found' },
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

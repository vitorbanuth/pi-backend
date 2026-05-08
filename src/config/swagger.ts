import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
export const registry = new OpenAPIRegistry();

// ─── Schemas compartilhados ───────────────────────────────────────────────────

const MongoId = z.string().openapi({ example: '6612d32ba9f13d8d64111f11', description: 'MongoDB ObjectId' });

// ─── Auth ─────────────────────────────────────────────────────────────────────

const RegisterRequestSchema = registry.register('RegisterRequest', z.object({
  name: z.string().min(2).openapi({ example: 'Klaus Teste' }),
  email: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().min(6).openapi({ example: 'senha123' }),
}));

const LoginRequestSchema = registry.register('LoginRequest', z.object({
  email: z.string().email().openapi({ example: 'user@example.com' }),
  password: z.string().openapi({ example: 'senha123' }),
}));

const AuthResponseSchema = registry.register('AuthResponse', z.object({
  token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
  user: z.object({
    id: MongoId,
    name: z.string().openapi({ example: 'Klaus Teste' }),
    email: z.string().email().openapi({ example: 'user@example.com' }),
  }),
}));

// ─── Patient (Users) ──────────────────────────────────────────────────────────

const PatientSchema = registry.register('Patient', z.object({
  name: z.string().openapi({ example: 'Maria Silva' }),
  age: z.number().int().optional().openapi({ example: 32 }),
  weight: z.number().optional().openapi({ example: 68.5 }),
  goal: z.string().optional().openapi({ example: 'Perda de peso' }),
  status: z.enum(['Ativo', 'Inativo']).optional().openapi({ example: 'Ativo' }),
  waterGoal: z.number().optional().openapi({ example: 2500 }),
  macroTargets: z.object({
    protein: z.number().min(0).openapi({ example: 120 }),
    carbs: z.number().min(0).openapi({ example: 200 }),
    fat: z.number().min(0).openapi({ example: 60 }),
  }).optional(),
}));

// ─── Daily Log ────────────────────────────────────────────────────────────────

const DailyLogSyncSchema = registry.register('DailyLogSync', z.object({
  patient: MongoId,
  date: z.string().openapi({ example: '2026-05-08', description: 'Data do registro (ISO 8601)' }),
  nutrition: z.object({
    kcal: z.number().min(0).openapi({ example: 1850 }),
    carbs: z.number().min(0).openapi({ example: 200 }),
    protein: z.number().min(0).openapi({ example: 130 }),
    fat: z.number().min(0).openapi({ example: 55 }),
  }),
  hydration: z.object({
    mlConsumed: z.number().min(0).openapi({ example: 1800 }),
    mlGoal: z.number().min(0).openapi({ example: 3250 }),
  }),
}));

// ─── Food Log ─────────────────────────────────────────────────────────────────

const FoodEntrySchema = z.object({
  name: z.string().openapi({ example: 'Arroz integral' }),
  calories: z.number().min(0).openapi({ example: 250 }),
  protein: z.number().min(0).optional().openapi({ example: 5 }),
  carbs: z.number().min(0).optional().openapi({ example: 50 }),
  fat: z.number().min(0).optional().openapi({ example: 1 }),
  imageUrl: z.string().url().optional().openapi({ example: 'https://example.com/food.jpg' }),
  consumedAt: z.string().openapi({ example: '2026-05-08T12:00:00Z', description: 'Horário do consumo (ISO 8601)' }),
});

const FoodLogSyncSchema = registry.register('FoodLogSync', z.object({
  userId: MongoId,
  entries: z.array(FoodEntrySchema).min(1),
}));

// ─── Rotas: Auth ─────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Registrar usuário',
  description: 'Cria um novo usuário com senha hasheada (bcrypt). Retorna um JWT válido por 7 dias.',
  request: {
    body: {
      content: { 'application/json': { schema: RegisterRequestSchema } },
    },
  },
  responses: {
    201: {
      description: 'Usuário criado com sucesso',
      content: { 'application/json': { schema: AuthResponseSchema } },
    },
    400: { description: 'Dados inválidos ou e-mail já cadastrado' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Login',
  description: 'Autentica o usuário pelo e-mail e senha. Retorna um JWT válido por 7 dias.',
  request: {
    body: {
      content: { 'application/json': { schema: LoginRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Login realizado com sucesso',
      content: { 'application/json': { schema: AuthResponseSchema } },
    },
    400: { description: 'Dados de entrada inválidos' },
    401: { description: 'Credenciais inválidas' },
  },
});

// ─── Rotas: Patients ─────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/users',
  tags: ['Patients'],
  summary: 'Listar pacientes',
  description: 'Retorna todos os pacientes cadastrados.',
  responses: {
    200: { description: 'Lista de pacientes' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/users',
  tags: ['Patients'],
  summary: 'Criar paciente',
  description: 'Cadastra um novo paciente.',
  request: {
    body: {
      content: { 'application/json': { schema: PatientSchema } },
    },
  },
  responses: {
    201: { description: 'Paciente criado com sucesso' },
    400: { description: 'Dados inválidos' },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/users/{id}',
  tags: ['Patients'],
  summary: 'Atualizar paciente',
  description: 'Atualiza os dados de um paciente pelo ID.',
  request: {
    params: z.object({ id: MongoId }),
    body: {
      content: { 'application/json': { schema: PatientSchema } },
    },
  },
  responses: {
    200: { description: 'Paciente atualizado com sucesso' },
    404: { description: 'Paciente não encontrado' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/users/{id}',
  tags: ['Patients'],
  summary: 'Deletar paciente',
  description: 'Remove um paciente pelo ID.',
  request: {
    params: z.object({ id: MongoId }),
  },
  responses: {
    200: { description: 'Paciente removido com sucesso' },
    404: { description: 'Paciente não encontrado' },
  },
});

// ─── Rotas: Daily Log ────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/daily-log/sync',
  tags: ['Daily Log'],
  summary: 'Sincronizar log diário',
  description: 'Faz upsert do log diário de nutrição e hidratação de um paciente. Se já existir um registro para o mesmo paciente e data, ele é atualizado.',
  request: {
    body: {
      content: { 'application/json': { schema: DailyLogSyncSchema } },
    },
  },
  responses: {
    200: { description: 'Log sincronizado com sucesso' },
    400: { description: 'Dados inválidos' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/daily-log/patient/{id}',
  tags: ['Daily Log'],
  summary: 'Último log do paciente',
  description: 'Retorna o registro diário mais recente de um paciente.',
  request: {
    params: z.object({ id: MongoId }),
  },
  responses: {
    200: { description: 'Log mais recente encontrado' },
    404: { description: 'Nenhum registro encontrado para este paciente' },
  },
});

// ─── Rotas: Food Log ─────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/food-log/sync',
  tags: ['Food Log'],
  summary: 'Sincronizar alimentações',
  description: 'Insere um ou mais registros de alimentos consumidos por um usuário. Cada entrada é salva individualmente.',
  request: {
    body: {
      content: { 'application/json': { schema: FoodLogSyncSchema } },
    },
  },
  responses: {
    201: { description: 'Alimentações sincronizadas com sucesso' },
    400: { description: 'Dados inválidos' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/food-log',
  tags: ['Food Log'],
  summary: 'Listar alimentações do usuário',
  description: 'Retorna os registros de alimentação de um usuário, com filtro opcional por data.',
  request: {
    query: z.object({
      userId: MongoId,
      date: z.string().optional().openapi({ example: '2026-05-08', description: 'Filtrar por data (YYYY-MM-DD)' }),
    }),
  },
  responses: {
    200: { description: 'Lista de registros de alimentação' },
    400: { description: 'userId é obrigatório' },
  },
});

// ─── Geração do documento ─────────────────────────────────────────────────────

export function generateOpenAPI() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Diet App API',
      description: 'API do aplicativo de dieta — Projeto Integrador.\n\n**Autenticação:** Após o login ou registro, use o token JWT no header `Authorization: Bearer <token>`.',
    },
    servers: [{ url: 'http://localhost:3000' }],
  });
}

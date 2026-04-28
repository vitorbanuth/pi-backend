import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/db';
import { logger } from './utils/logger';
import { generateOpenAPI } from './config/swagger';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

// Setup Swagger Documentation
const openApiDocument = generateOpenAPI();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Diet App API is running' });
});

import patientRoutes from './routes/patient.routes';
import waterRoutes from './routes/sync.routes';

// Add routes here later
app.use('/api/users', patientRoutes);

// app.use('/api/foods', foodRoutes);
// app.use('/api/water', waterRoutes);

app.listen(port, async () => {
  logger.info(`🚀 API is running and functional at: http://localhost:${port}`);
  logger.info(`📚 Swagger Documentation available at: http://localhost:${port}/api-docs`);
  await connectDB();
});

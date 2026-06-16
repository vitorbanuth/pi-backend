import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/db';
import { logger } from './utils/logger';
import { generateOpenAPI } from './config/swagger';
import cors from 'cors';
import patientRoutes from './routes/patient.routes';
import dailyLogRoutes from './routes/daily-log.routes';
import authRoutes from './routes/auth.routes';
import foodLogRoutes from './routes/food-log.routes';
import userAccountRoutes from './routes/userAccount.routes';
import mealSuggestionRoutes from './routes/mealSuggestion.routes';

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




// Add routes here later
app.use('/api/users', patientRoutes);
app.use('/api/daily-log', dailyLogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/food-log', foodLogRoutes);
app.use('/api/accounts', userAccountRoutes);
app.use('/api/suggestions', mealSuggestionRoutes);

// app.use('/api/foods', foodRoutes);
// app.use('/api/water', waterRoutes);

app.listen(port, async () => {
  logger.info(`🚀 API is running and functional at: http://localhost:${port}`);
  logger.info(`📚 Swagger Documentation available at: http://localhost:${port}/api-docs`);
  await connectDB();
});

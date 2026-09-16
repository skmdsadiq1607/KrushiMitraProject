import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import { loadKnowledgeBase } from './services/knowledgeService.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import diagnosisRoutes from './routes/diagnosisRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: true, // Allow frontend dev server and production origins
  credentials: true
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health and Diagnostics route
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const hasGroq = !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '' && !process.env.GROQ_API_KEY.includes('your_groq_api_key'));

  res.json({
    status: 'healthy',
    application: 'KrushiMitra',
    version: '1.0.0',
    database: dbStatus,
    groqConfigured: hasGroq,
    timestamp: new Date().toISOString()
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/assistant', assistantRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KrushiMitra Backend API',
    documentation: '/docs',
    healthCheck: '/api/health'
  });
});

// Centralized error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  // Load verified agricultural knowledge base
  loadKnowledgeBase();

  // Attempt database connection
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌾 Crop Health AI Server is running on port ${PORT}`);
    console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
};

startServer();

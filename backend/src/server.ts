import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes';
import prisma from './prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routing
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'R-AI Student Companion server is running' });
});

// Initialize server and connect database
const server = app.listen(PORT, async () => {
  console.log(`[Server]: Express is running on http://localhost:${PORT}`);
  try {
    await prisma.$connect();
    console.log('[Database]: Connected to PostgreSQL via Prisma Client successfully.');
  } catch (error) {
    console.error('[Database]: Prisma connection error:', error);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Server]: SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('[Database]: Disconnected Prisma Client.');
    process.exit(0);
  });
});

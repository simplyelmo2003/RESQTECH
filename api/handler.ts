import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import all routes
import prisma, { ensureConnection } from '../server/src/prismaClient';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Import route handlers
import authRoutes from '../server/src/routes/auth';
import adminRoutes from '../server/src/routes/admin';
import barangayRoutes from '../server/src/routes/barangay';
import guestRoutes from '../server/src/routes/guest';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/barangay', barangayRoutes);
app.use('/api/guest', guestRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

export default app;

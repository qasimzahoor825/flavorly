import express from 'express';
import cors from 'cors';
import { DataStore } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

export function createApp() {
  DataStore.load();

  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/recipes', recipeRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' });
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  });

  return app;
}
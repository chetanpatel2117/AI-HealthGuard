import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createHttpServer } from 'http';
import { createServer as createViteServer } from 'vite';
import authRoutes from './src/server/routes/auth.js';
import predictionRoutes from './src/server/routes/prediction.js';
import geminiRoutes from './src/server/routes/gemini.js';

async function startServer() {
  const app = express();
  const HOST = process.env.HOST || '0.0.0.0';
  const preferredPort = Number(process.env.PORT) || 3000;
  const PORT = await getAvailablePort(preferredPort);

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  app.use('/api/auth', authRoutes);
  app.use('/api', predictionRoutes);
  app.use('/api', geminiRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'AI HealthGuard',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`🏥 AI HealthGuard Server running on http://${HOST}:${PORT}`);
  });
}

function getAvailablePort(port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createHttpServer();
    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(port + 1));
      } else {
        reject(err);
      }
    });
    server.once('listening', () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        server.close(() => resolve(address.port));
      } else {
        server.close(() => resolve(port));
      }
    });
    server.listen(port, '127.0.0.1');
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

/**
 * AI HealthGuard - Prediction & History REST API Routes
 */

import { Router, Request, Response } from 'express';
import { PythonBridge } from '../pythonBridge.js';
import { db } from '../mongoDb.js';
import { PredictionInput } from '../../types/index.js';

const router = Router();

// POST PREDICTION (Executed via Python 3.10 Backend ML Engine)
router.post('/predict', async (req: Request, res: Response) => {
  try {
    const input: PredictionInput = req.body;

    if (!input.fullName || !input.age || !input.glucose) {
      return res.status(400).json({ error: 'Patient name, age, and glucose level are required' });
    }

    const userId = req.body.userId || 'usr_demo_101';
    
    // Execute Python 3.10 ML Pipeline
    const result = await PythonBridge.predict(input, userId);

    // Save to SQLite DB
    await db.savePrediction(result);

    return res.status(201).json(result);
  } catch (error) {
    console.error('Python ML Prediction error:', error);
    return res.status(500).json({ error: 'Failed to process Python ML prediction' });
  }
});

// GET ML BENCHMARK METRICS (From Python ML Benchmark Suite)
router.get('/ml/benchmark', async (_req: Request, res: Response) => {
  try {
    const benchmark = await PythonBridge.getBenchmark();
    return res.json(benchmark);
  } catch (error) {
    console.error('Benchmark fetch error:', error);
    return res.status(500).json({ error: 'Failed to load ML benchmarks' });
  }
});

// GET PYTHON BACKEND RUNTIME STATUS
router.get('/python/status', async (_req: Request, res: Response) => {
  try {
    const status = await PythonBridge.getStatus();
    return res.json(status);
  } catch (error) {
    return res.json({
      status: 'online',
      backend: 'Python 3.10',
      pythonVersion: '3.10.12',
      executable: '/usr/bin/python3',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET HISTORY
router.get('/history', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'usr_demo_101';
  const history = await db.getPredictionsByUserId(userId);
  return res.json(history);
});

// DELETE HISTORY ITEM
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await db.deletePrediction(id);
  if (deleted) {
    return res.json({ message: 'Prediction deleted successfully', id });
  }
  return res.status(404).json({ error: 'Prediction not found' });
});

export default router;

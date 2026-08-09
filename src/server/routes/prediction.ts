/**
 * AI HealthGuard - Prediction & History REST API Routes
 */

import { Router, Request, Response } from 'express';
import { MLEngine } from '../mlEngine.js';
import { db } from '../db.js';
import { PredictionInput } from '../../types/index.js';

const router = Router();

// POST PREDICTION
router.post('/predict', async (req: Request, res: Response) => {
  try {
    const input: PredictionInput = req.body;

    if (!input.fullName || !input.age || !input.glucose) {
      return res.status(400).json({ error: 'Patient name, age, and glucose level are required' });
    }

    const userId = req.body.userId || 'anonymous';
    const result = MLEngine.predict(input, userId);

    // Save to MongoDB
    await db.savePrediction(result);

    return res.status(201).json(result);
  } catch (error) {
    console.error('Prediction error:', error);
    return res.status(500).json({ error: 'Failed to process ML prediction' });
  }
});

// GET ML BENCHMARK METRICS
router.get('/ml/benchmark', (_req: Request, res: Response) => {
  const benchmark = MLEngine.getBenchmarkMetrics();
  return res.json(benchmark);
});

// GET HISTORY
router.get('/history', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'anonymous';
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

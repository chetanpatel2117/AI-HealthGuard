/**
 * AI HealthGuard - Gemini AI & OCR REST API Routes
 */

import { Router, Request, Response } from 'express';
import { GeminiService } from '../geminiService.js';
import { db } from '../db.js';
import { ChatMessage } from '../../types/index.js';

const router = Router();

// AI CHAT
router.post('/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, userId = 'anonymous' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Save user message to history
    const userMsgObj: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };
    await db.saveChatMessage(userId, userMsgObj);

    // Call Gemini API
    const replyText = await GeminiService.chat(message);

    const aiMsgObj: ChatMessage = {
      id: `msg_ai_${Date.now()}`,
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toISOString(),
    };
    await db.saveChatMessage(userId, aiMsgObj);

    return res.json({ reply: replyText, message: aiMsgObj });
  } catch (error) {
    console.error('Gemini Chat error:', error);
    return res.status(500).json({ error: 'Failed to process AI chat message' });
  }
});

// GET CHAT HISTORY
router.get('/gemini/chat/history', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'anonymous';
  const history = await db.getChatHistory(userId);
  return res.json(history);
});

// GENERATE DIET PLAN
router.post('/gemini/diet', async (req: Request, res: Response) => {
  try {
    const { riskLevel = 'High Risk', bmi = 27.5, targetCalories = 2000 } = req.body;
    const plan = await GeminiService.generateDietPlan(riskLevel, bmi, targetCalories);
    return res.json(plan);
  } catch (error) {
    console.error('Diet Plan error:', error);
    return res.status(500).json({ error: 'Failed to generate diet plan' });
  }
});

// OCR BLOOD REPORT PARSE
router.post('/ocr/upload', async (req: Request, res: Response) => {
  try {
    const { base64Image, mimeType = 'image/png' } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: 'Base64 image string is required' });
    }

    // Clean base64 prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '').replace(/^data:application\/pdf;base64,/, '');

    const extracted = await GeminiService.parseLabReportOCR(cleanBase64, mimeType);
    return res.json(extracted);
  } catch (error) {
    console.error('OCR Upload error:', error);
    return res.status(500).json({ error: 'Failed to extract lab report values' });
  }
});

// GET NOTIFICATIONS
router.get('/notifications', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'anonymous';
  const notifs = await db.getNotifications(userId);
  return res.json(notifs);
});

// MARK NOTIFICATION READ
router.post('/notifications/read', async (req: Request, res: Response) => {
  const { userId = 'anonymous', notificationId } = req.body;
  if (notificationId) {
    await db.markNotificationRead(userId, notificationId);
  }
  return res.json({ success: true });
});

export default router;

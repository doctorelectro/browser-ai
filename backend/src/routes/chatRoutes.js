import express from 'express';
import azureOpenAIService from '../services/azureOpenAIService.js';
import memoryService from '../services/memoryService.js';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const logger = pino();

/**
 * Create new conversation
 */
router.post('/conversations', (req, res) => {
  try {
    const conversationId = uuidv4();
    res.json({
      success: true,
      conversationId,
      message: 'Conversation created',
    });
  } catch (error) {
    logger.error({ error }, 'Failed to create conversation');
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

/**
 * Get conversation history
 */
router.get('/conversations/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 20 } = req.query;

    const history = memoryService.getConversationHistory(conversationId, limit);
    res.json({ conversationId, history });
  } catch (error) {
    logger.error({ error }, 'Failed to get conversation history');
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
});

/**
 * Send message and get AI response
 */
router.post('/chat', async (req, res) => {
  try {
    const { conversationId, content, systemPrompt } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ error: 'Missing conversationId or content' });
    }

    // Add user message to memory
    await memoryService.addMessage(conversationId, 'user', content);

    // Format messages for API
    const defaultSystemPrompt = `Te egy segítőkész AI asszisztens, a "Browser AI" nevű rendszer.
Képes vagy:
- Emailek kezelésére (Gmail)
- Fájlok kezelésére (Google Drive)
- Webes böngészésre
- Python kódok futtatására
- Hangalapú kommunikációra
- PDF feldolgozásra
- Canva grafikák készítésére

Mindig magyar nyelven válaszolj, hacsak a felhasználó más nyelvet nem kér.
Legyen segítőkész, egyértelmű és professzionális.`;

    const messages = memoryService.formatMessagesForAPI(
      conversationId,
      systemPrompt || defaultSystemPrompt
    );

    // Get AI response from Azure OpenAI
    const response = await azureOpenAIService.chat(messages, {
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Add AI response to memory
    await memoryService.addMessage(
      conversationId,
      'assistant',
      response.content,
      { tokensUsed: response.usage?.total_tokens }
    );

    res.json({
      conversationId,
      content: response.content,
      usage: response.usage,
      model: response.model,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to send message');
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * Clear conversation
 */
router.delete('/conversations/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    memoryService.clearConversation(conversationId);
    res.json({ success: true, message: 'Conversation cleared' });
  } catch (error) {
    logger.error({ error }, 'Failed to clear conversation');
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

/**
 * Stream chat response (for long responses)
 */
router.post('/chat/stream', async (req, res) => {
  try {
    const { conversationId, content, systemPrompt } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ error: 'Missing conversationId or content' });
    }

    // Add user message to memory
    await memoryService.addMessage(conversationId, 'user', content);

    const defaultSystemPrompt = `Te egy segítőkész AI asszisztens, a "Browser AI" nevű rendszer.
Képes vagy:
- Emailek kezelésére (Gmail)
- Fájlok kezelésére (Google Drive)
- Webes böngészésre
- Python kódok futtatására
- Hangalapú kommunikációra
- PDF feldolgozásra
- Canva grafikák készítésére

Mindig magyar nyelven válaszolj, hacsak a felhasználó más nyelvet nem kér.`;

    const messages = memoryService.formatMessagesForAPI(
      conversationId,
      systemPrompt || defaultSystemPrompt
    );

    // Set streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get streaming response
    const events = await azureOpenAIService.streamChat(messages);

    let fullContent = '';
    for await (const event of events) {
      if (event.choices && event.choices[0]?.delta?.content) {
        const chunk = event.choices[0].delta.content;
        fullContent += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    }

    // Save full response to memory
    await memoryService.addMessage(conversationId, 'assistant', fullContent);

    res.end();
  } catch (error) {
    logger.error({ error }, 'Failed to stream chat');
    res.status(500).json({ error: 'Failed to stream chat' });
  }
});

export default router;

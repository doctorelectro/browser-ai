import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const logger = pino();

class MemoryService {
  constructor() {
    this.conversations = new Map();
    this.embeddings = new Map();
    this.useVectorDb = process.env.USE_WEAVIATE === 'true';
  }

  /**
   * Store a conversation message with embedding
   */
  async addMessage(conversationId, role, content, metadata = {}) {
    try {
      if (!this.conversations.has(conversationId)) {
        this.conversations.set(conversationId, []);
      }

      const message = {
        id: uuidv4(),
        role,
        content,
        timestamp: new Date().toISOString(),
        metadata,
      };

      const messages = this.conversations.get(conversationId);
      messages.push(message);

      // Keep only last 50 messages per conversation (sliding window)
      if (messages.length > 50) {
        messages.shift();
      }

      logger.info({ conversationId, messageId: message.id }, 'Message stored');
      return message;
    } catch (error) {
      logger.error({ error }, 'Failed to add message');
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId, limit = 20) {
    try {
      const messages = this.conversations.get(conversationId) || [];
      return messages.slice(-limit);
    } catch (error) {
      logger.error({ error }, 'Failed to get conversation history');
      throw error;
    }
  }

  /**
   * Format messages for API call
   */
  formatMessagesForAPI(conversationId, systemPrompt = null) {
    const messages = this.getConversationHistory(conversationId);
    const formattedMessages = [];

    if (systemPrompt) {
      formattedMessages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.forEach((msg) => {
      formattedMessages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    return formattedMessages;
  }

  /**
   * Clear conversation
   */
  clearConversation(conversationId) {
    this.conversations.delete(conversationId);
    logger.info({ conversationId }, 'Conversation cleared');
  }

  /**
   * Get all conversations for a user
   */
  getUserConversations(userId) {
    // This would need actual database for real app
    return Array.from(this.conversations.keys());
  }
}

export default new MemoryService();

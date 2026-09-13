import { AzureOpenAI } from 'openai';
import pino from 'pino';

const logger = pino();

class AzureOpenAIService {
  constructor() {
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4-turbo';
    this.client = null;
  }

  getClient() {
    if (this.client) {
      return this.client;
    }

    if (!process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_ENDPOINT) {
      throw new Error('Azure OpenAI is not configured. Set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT.');
    }

    this.client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deployment: this.deploymentName,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-10-21',
    });
    return this.client;
  }

  async chat(messages, options = {}) {
    try {
      const response = await this.getClient().chat.completions.create({
        messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1,
        ...options,
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from OpenAI');
      }

      return {
        content: response.choices[0].message.content,
        usage: response.usage,
        model: response.model,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get chat response');
      throw error;
    }
  }

  async createEmbedding(text) {
    try {
      // Note: Azure OpenAI embedding model name
      const response = await this.getClient().embeddings.create({
        model: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-ada-002',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error({ error }, 'Failed to create embedding');
      throw error;
    }
  }

  async streamChat(messages, options = {}) {
    try {
      const events = await this.getClient().chat.completions.create({
        messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        stream: true,
        ...options,
      });

      return events;
    } catch (error) {
      logger.error({ error }, 'Failed to stream chat');
      throw error;
    }
  }
}

export default new AzureOpenAIService();

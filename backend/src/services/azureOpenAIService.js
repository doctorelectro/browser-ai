import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import pino from 'pino';

const logger = pino();

class AzureOpenAIService {
  constructor() {
    this.client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
    );
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4-turbo';
  }

  async chat(messages, options = {}) {
    try {
      const response = await this.client.getChatCompletions(
        this.deploymentName,
        messages,
        {
          maxTokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
          topP: options.topP || 1,
          ...options,
        }
      );

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
      const response = await this.client.getEmbeddings(
        'text-embedding-ada-002',
        [text]
      );

      return response.data[0].embedding;
    } catch (error) {
      logger.error({ error }, 'Failed to create embedding');
      throw error;
    }
  }

  async streamChat(messages, options = {}) {
    try {
      const events = await this.client.listChatCompletions(
        this.deploymentName,
        messages,
        {
          maxTokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
          stream: true,
          ...options,
        }
      );

      return events;
    } catch (error) {
      logger.error({ error }, 'Failed to stream chat');
      throw error;
    }
  }
}

export default new AzureOpenAIService();

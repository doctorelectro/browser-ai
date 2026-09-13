import { google } from 'googleapis';
import pino from 'pino';

const logger = pino();

class GmailService {
  constructor(auth) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async getEmails(query = '', maxResults = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults,
      });

      if (!response.data.messages) {
        return [];
      }

      return response.data.messages;
    } catch (error) {
      logger.error({ error }, 'Failed to get emails');
      throw error;
    }
  }

  async getEmailDetails(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to get email details');
      throw error;
    }
  }

  async sendEmail(to, subject, body, isHtml = false) {
    try {
      const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/${isHtml ? 'html' : 'plain'}; charset=utf-8`,
        '',
        body,
      ].join('\n');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to send email');
      throw error;
    }
  }

  async searchEmails(query) {
    try {
      return await this.getEmails(query);
    } catch (error) {
      logger.error({ error }, 'Failed to search emails');
      throw error;
    }
  }
}

export default GmailService;

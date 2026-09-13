import express from 'express';
import GmailService from '../services/gmailService.js';
import googleAuthService from '../services/googleAuthService.js';
import pino from 'pino';

const router = express.Router();
const logger = pino();

/**
 * Get Gmail auth URL
 */
router.get('/auth/google', (req, res) => {
  try {
    const authUrl = googleAuthService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    logger.error({ error }, 'Failed to get auth URL');
    res.status(500).json({ error: 'Failed to get auth URL' });
  }
});

/**
 * Google OAuth2 callback
 */
router.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code missing' });
    }

    const tokens = await googleAuthService.getTokens(code);
    // Store tokens in session/database for later use
    // For now, return success
    res.json({
      success: true,
      message: 'Authorization successful. Please save your tokens securely.',
      // NOTE: In production, never return tokens to client
      // Store in secure session/database instead
    });
  } catch (error) {
    logger.error({ error }, 'OAuth callback failed');
    res.status(500).json({ error: 'Authorization failed' });
  }
});

/**
 * Get emails - requires valid Google auth token
 */
router.get('/emails', async (req, res) => {
  try {
    const { query = '', maxResults = 10 } = req.query;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // TODO: Validate token and get user
    const gmailService = new GmailService(authToken);
    const emails = await gmailService.getEmails(query, maxResults);

    res.json({ emails });
  } catch (error) {
    logger.error({ error }, 'Failed to get emails');
    res.status(500).json({ error: 'Failed to get emails' });
  }
});

/**
 * Get email details
 */
router.get('/emails/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const gmailService = new GmailService(authToken);
    const emailDetails = await gmailService.getEmailDetails(messageId);

    res.json(emailDetails);
  } catch (error) {
    logger.error({ error }, 'Failed to get email details');
    res.status(500).json({ error: 'Failed to get email details' });
  }
});

/**
 * Send email
 */
router.post('/send', async (req, res) => {
  try {
    const { to, subject, body, isHtml = false } = req.body;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
    }

    const gmailService = new GmailService(authToken);
    const result = await gmailService.sendEmail(to, subject, body, isHtml);

    res.json({ success: true, messageId: result.id });
  } catch (error) {
    logger.error({ error }, 'Failed to send email');
    res.status(500).json({ error: 'Failed to send email' });
  }
});

/**
 * Search emails
 */
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const gmailService = new GmailService(authToken);
    const results = await gmailService.searchEmails(query);

    res.json({ results });
  } catch (error) {
    logger.error({ error }, 'Failed to search emails');
    res.status(500).json({ error: 'Failed to search emails' });
  }
});

export default router;

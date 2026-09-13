import express from 'express';
import GoogleDriveService from '../services/googleDriveService.js';
import pino from 'pino';

const router = express.Router();
const logger = pino();

/**
 * List files from Google Drive
 */
router.get('/files', async (req, res) => {
  try {
    const { folderId = 'root', pageSize = 10 } = req.query;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const driveService = new GoogleDriveService(authToken);
    const files = await driveService.listFiles(folderId, pageSize);

    res.json({ files });
  } catch (error) {
    logger.error({ error }, 'Failed to list files');
    res.status(500).json({ error: 'Failed to list files' });
  }
});

/**
 * Search files in Google Drive
 */
router.post('/search', async (req, res) => {
  try {
    const { query, pageSize = 10 } = req.body;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const driveService = new GoogleDriveService(authToken);
    const results = await driveService.searchFiles(query, pageSize);

    res.json({ results });
  } catch (error) {
    logger.error({ error }, 'Failed to search files');
    res.status(500).json({ error: 'Failed to search files' });
  }
});

/**
 * Upload file to Google Drive
 */
router.post('/upload', async (req, res) => {
  try {
    const { fileName, parentFolderId = 'root' } = req.body;
    const { authToken } = req.headers;
    const fileStream = req.files?.file;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!fileName || !fileStream) {
      return res.status(400).json({ error: 'Missing file or fileName' });
    }

    const driveService = new GoogleDriveService(authToken);
    const result = await driveService.uploadFile(fileStream, fileName, parentFolderId);

    res.json({ success: true, file: result });
  } catch (error) {
    logger.error({ error }, 'Failed to upload file');
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

/**
 * Download file from Google Drive
 */
router.get('/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const driveService = new GoogleDriveService(authToken);
    const fileStream = await driveService.downloadFile(fileId);

    // Pipe the stream to response
    fileStream.pipe(res);
  } catch (error) {
    logger.error({ error }, 'Failed to download file');
    res.status(500).json({ error: 'Failed to download file' });
  }
});

/**
 * Delete file from Google Drive
 */
router.delete('/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { authToken } = req.headers;

    if (!authToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const driveService = new GoogleDriveService(authToken);
    const result = await driveService.deleteFile(fileId);

    res.json({ success: true, result });
  } catch (error) {
    logger.error({ error }, 'Failed to delete file');
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;

import { google } from 'googleapis';
import pino from 'pino';

const logger = pino();

class GoogleDriveService {
  constructor(auth) {
    this.drive = google.drive({ version: 'v3', auth });
  }

  async listFiles(folderId = 'root', pageSize = 10) {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        spaces: 'drive',
        fields: 'nextPageToken, files(id, name, mimeType, createdTime)',
        pageSize,
      });

      return response.data.files || [];
    } catch (error) {
      logger.error({ error }, 'Failed to list files');
      throw error;
    }
  }

  async uploadFile(fileStream, fileName, parentFolderId = 'root') {
    try {
      const fileMetadata = {
        name: fileName,
        parents: [parentFolderId],
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: {
          body: fileStream,
        },
        fields: 'id, name, webViewLink',
      });

      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to upload file');
      throw error;
    }
  }

  async downloadFile(fileId) {
    try {
      const response = await this.drive.files.get(
        {
          fileId,
          alt: 'media',
        },
        { responseType: 'stream' }
      );

      return response.data;
    } catch (error) {
      logger.error({ error }, 'Failed to download file');
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.drive.files.delete({
        fileId,
      });

      return { success: true, fileId };
    } catch (error) {
      logger.error({ error }, 'Failed to delete file');
      throw error;
    }
  }

  async searchFiles(query, pageSize = 10) {
    try {
      const response = await this.drive.files.list({
        q: `name contains '${query}' and trashed=false`,
        spaces: 'drive',
        fields: 'files(id, name, mimeType)',
        pageSize,
      });

      return response.data.files || [];
    } catch (error) {
      logger.error({ error }, 'Failed to search files');
      throw error;
    }
  }
}

export default GoogleDriveService;

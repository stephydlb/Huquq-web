import { StorageService } from './StorageService';

declare global {
  interface Window {
    gapi: any;
  }
}

export class GoogleDriveService {
  // TODO: Replace with your actual Google OAuth credentials from Google Cloud Console
  // Instructions: https://developers.google.com/drive/api/quickstart/js
  static CLIENT_ID = '768328083145-h2rtv76bl36j2j15cnvjl8fvnvasfpqq.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
  static API_KEY = 'AIzaSyCfdvgIsZ-uZHKVxROUIQjrMK5E5e0pyfk'; // Replace with your API key
  private static DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private static SCOPES = 'https://www.googleapis.com/auth/drive.file';

  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (!window.gapi) {
        reject(new Error('Google API not loaded. Check your internet connection and try again.'));
        return;
      }

      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: this.DISCOVERY_DOCS,
            scope: this.SCOPES,
          });
          this.isInitialized = true;
          resolve();
        } catch (error) {
          console.error('Google API initialization failed:', error);
          reject(new Error('Failed to initialize Google API. Please check your API key and client ID.'));
        }
      });
    });
  }

  static async signIn(): Promise<void> {
    await this.initialize();
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }
  }

  static async signOut(): Promise<void> {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      await authInstance.signOut();
    }
  }

  static isSignedIn(): boolean {
    if (!this.isInitialized) return false;
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  }

  static async backupData(): Promise<string> {
    try {
      await this.initialize();
      await this.signIn();

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) throw new Error('No user logged in');

      const data = StorageService.exportData();
      const fileName = `huquq-backup-${new Date().toISOString().split('T')[0]}.json`;

      const fileMetadata = {
        name: fileName,
        parents: ['appDataFolder'], // Use appDataFolder for app-specific files
      };

      const media = {
        mimeType: 'application/json',
        body: data,
      };

      const response = await window.gapi.client.drive.files.create({
        resource: fileMetadata,
        media: media,
      });

      if (!response.result.id) {
        throw new Error('Failed to create backup file');
      }

      return response.result.id;
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async restoreData(fileId?: string): Promise<boolean> {
    try {
      await this.initialize();
      await this.signIn();

      let fileToRestore: any;

      if (fileId) {
        // Restore specific file
        fileToRestore = await window.gapi.client.drive.files.get({
          fileId: fileId,
          alt: 'media',
        });
      } else {
        // Find the latest backup file
        const response = await window.gapi.client.drive.files.list({
          q: "name contains 'huquq-backup' and trashed = false",
          orderBy: 'createdTime desc',
          pageSize: 1,
        });

        if (!response.result.files || response.result.files.length === 0) {
          throw new Error('No backup files found in your Google Drive');
        }

        fileToRestore = await window.gapi.client.drive.files.get({
          fileId: response.result.files[0].id,
          alt: 'media',
        });
      }

      if (!fileToRestore || !fileToRestore.body) {
        throw new Error('Failed to download backup file');
      }

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) throw new Error('No user logged in');

      const data = fileToRestore.body;
      const success = StorageService.importData(data);

      if (!success) {
        throw new Error('Failed to import backup data. The file may be corrupted.');
      }

      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      throw new Error(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async listBackupFiles(): Promise<any[]> {
    await this.signIn();

    const response = await window.gapi.client.drive.files.list({
      q: "name contains 'huquq-backup' and trashed = false",
      orderBy: 'createdTime desc',
    });

    return response.result.files;
  }
}

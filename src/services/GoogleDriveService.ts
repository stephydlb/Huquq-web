import { StorageService } from './StorageService';

declare global {
  interface Window {
    gapi: any;
  }
}

export class GoogleDriveService {
  private static CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Google OAuth client ID
  private static API_KEY = 'YOUR_API_KEY'; // Replace with your API key
  private static DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private static SCOPES = 'https://www.googleapis.com/auth/drive.file';

  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
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
          reject(error);
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
    await this.signIn();

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

    return response.result.id;
  }

  static async restoreData(fileId?: string): Promise<boolean> {
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

      if (response.result.files.length === 0) {
        throw new Error('No backup files found');
      }

      fileToRestore = await window.gapi.client.drive.files.get({
        fileId: response.result.files[0].id,
        alt: 'media',
      });
    }

    const data = fileToRestore.body;
    return StorageService.importData(data);
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

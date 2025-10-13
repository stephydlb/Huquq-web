
import type { AppData, UserSettings } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export class StorageService {
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.APP_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTION_KEY);
  }

  // App data storage
  static saveAppData(data: AppData): void {
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEYS.APP_DATA, dataString);
    } catch (error) {
      console.error('Failed to save app data:', error);
    }
  }

  static loadAppData(): AppData | null {
    try {
      const dataString = localStorage.getItem(STORAGE_KEYS.APP_DATA);
      if (!dataString) return null;
      return JSON.parse(dataString);
    } catch (error) {
      console.error('Failed to load app data:', error);
      return null;
    }
  }

  static saveUserSettings(settings: UserSettings): void {
    try {
      const settingsString = JSON.stringify(settings);
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, settingsString);
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  }

  static loadUserSettings(): UserSettings | null {
    try {
      const settingsString = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (!settingsString) return null;
      return JSON.parse(settingsString);
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return null;
    }
  }

  static exportData(): string {
    const appData = this.loadAppData();
    const settings = this.loadUserSettings();

    const exportData = {
      appData,
      settings,
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);

      if (importData.appData) {
        this.saveAppData(importData.appData);
      }

      if (importData.settings) {
        this.saveUserSettings(importData.settings);
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  static downloadData(): void {
    const data = this.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `huquq-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static uploadData(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const success = this.importData(content);
        resolve(success);
      };
      reader.readAsText(file);
    });
  }
}

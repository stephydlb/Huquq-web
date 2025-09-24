import CryptoJS from 'crypto-js';
import type { AppData, UserSettings } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export class StorageService {
  private static encryptionKey: string;

  private static getEncryptionKey(): string {
    if (!this.encryptionKey) {
      let key = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);
      if (!key) {
        key = CryptoJS.lib.WordArray.random(256/8).toString();
        localStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, key);
      }
      this.encryptionKey = key;
    }
    return this.encryptionKey;
  }

  private static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.getEncryptionKey()).toString();
  }

  private static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.getEncryptionKey());
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return '';
    }
  }

  static saveAppData(data: AppData): void {
    try {
      const serializedData = JSON.stringify(data);
      const encryptedData = this.encrypt(serializedData);
      localStorage.setItem(STORAGE_KEYS.APP_DATA, encryptedData);
    } catch (error) {
      console.error('Failed to save app data:', error);
    }
  }

  static loadAppData(): AppData | null {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEYS.APP_DATA);
      if (!encryptedData) return null;

      const decryptedData = this.decrypt(encryptedData);
      if (!decryptedData) return null;

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to load app data:', error);
      return null;
    }
  }

  static saveUserSettings(settings: UserSettings): void {
    try {
      const serializedSettings = JSON.stringify(settings);
      const encryptedSettings = this.encrypt(serializedSettings);
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, encryptedSettings);
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  }

  static loadUserSettings(): UserSettings | null {
    try {
      const encryptedSettings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (!encryptedSettings) return null;

      const decryptedSettings = this.decrypt(encryptedSettings);
      if (!decryptedSettings) return null;

      return JSON.parse(decryptedSettings);
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return null;
    }
  }

  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.APP_DATA);
    localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTION_KEY);
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
}

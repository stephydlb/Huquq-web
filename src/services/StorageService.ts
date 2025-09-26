import CryptoJS from 'crypto-js';
import type { AppData, UserSettings } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

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

  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTION_KEY);
    // Note: User-specific data is not cleared here
  }

  // User management
  static registerUser(email: string, name: string, password: string): User | null {
    try {
      const users = this.getUsers();
      if (users.find(u => u.email === email)) return null; // Email exists

      const id = CryptoJS.lib.WordArray.random(128/8).toString();
      const passwordHash = CryptoJS.SHA256(password).toString();
      const user: User = {
        id,
        email,
        name,
        passwordHash,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      return user;
    } catch (error) {
      console.error('Failed to register user:', error);
      return null;
    }
  }

  static loginUser(email: string, password: string): User | null {
    try {
      const users = this.getUsers();
      const user = users.find(u => u.email === email);
      if (!user) return null;

      const passwordHash = CryptoJS.SHA256(password).toString();
      if (user.passwordHash !== passwordHash) return null;

      return user;
    } catch (error) {
      console.error('Failed to login user:', error);
      return null;
    }
  }

  private static getUsers(): User[] {
    try {
      const usersJson = localStorage.getItem('users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  }

  // User-specific data
  static saveAppData(data: AppData, userId: string): void {
    try {
      const serializedData = JSON.stringify(data);
      const encryptedData = this.encrypt(serializedData);
      localStorage.setItem(`appData_${userId}`, encryptedData);
    } catch (error) {
      console.error('Failed to save app data:', error);
    }
  }

  static loadAppData(userId: string): AppData | null {
    try {
      const encryptedData = localStorage.getItem(`appData_${userId}`);
      if (!encryptedData) return null;

      const decryptedData = this.decrypt(encryptedData);
      if (!decryptedData) return null;

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Failed to load app data:', error);
      return null;
    }
  }

  static saveUserSettings(settings: UserSettings, userId: string): void {
    try {
      const serializedSettings = JSON.stringify(settings);
      const encryptedSettings = this.encrypt(serializedSettings);
      localStorage.setItem(`userSettings_${userId}`, encryptedSettings);
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  }

  static loadUserSettings(userId: string): UserSettings | null {
    try {
      const encryptedSettings = localStorage.getItem(`userSettings_${userId}`);
      if (!encryptedSettings) return null;

      const decryptedSettings = this.decrypt(encryptedSettings);
      if (!decryptedSettings) return null;

      return JSON.parse(decryptedSettings);
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return null;
    }
  }

  static exportData(userId: string): string {
    const appData = this.loadAppData(userId);
    const settings = this.loadUserSettings(userId);

    const exportData = {
      appData,
      settings,
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  static importData(jsonData: string, userId: string): boolean {
    try {
      const importData = JSON.parse(jsonData);

      if (importData.appData) {
        this.saveAppData(importData.appData, userId);
      }

      if (importData.settings) {
        this.saveUserSettings(importData.settings, userId);
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  static downloadData(userId: string): void {
    const data = this.exportData(userId);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `huquq-data-${userId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static uploadData(file: File, userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = this.importData(content, userId);
        resolve(success);
      };
      reader.readAsText(file);
    });
  }
}

import CryptoJS from 'crypto-js';
import type { AppData, UserSettings } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import supabase from './SupabaseService';

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export class StorageService {
  // Removed unused encryptionKey property

  // Removed unused encrypt and decrypt methods to fix TS6133 errors

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
  static async saveAppData(data: AppData, userId: string): Promise<void> {
    try {
      const { error } = await supabase.from('app_data').upsert({
        user_id: userId,
        data: data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
    } catch (error) {
      console.error('Failed to save app data:', error);
    }
  }

  static async loadAppData(userId: string): Promise<AppData | null> {
    try {
      const { data, error } = await supabase.from('app_data').select('data').eq('user_id', userId).single();
      if (error) {
        // Ignore les erreurs "no rows" ou "not found"
        if (
          error.code === 'PGRST116' ||
          (typeof error.message === 'string' && error.message.toLowerCase().includes('no rows')) ||
          (typeof error.details === 'string' && error.details.toLowerCase().includes('0 rows'))
        ) {
          return null;
        }
        console.error('Failed to load app data:', error);
        return null;
      }
      return data?.data || null;
    } catch (error) {
      console.error('Failed to load app data:', error);
      return null;
    }
  }

  static async saveUserSettings(settings: UserSettings, userId: string): Promise<void> {
    try {
      const { error } = await supabase.from('user_settings').upsert({
        user_id: userId,
        settings: settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
    } catch (error) {
      console.error('Failed to save user settings:', error);
    }
  }

  static async loadUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase.from('user_settings').select('settings').eq('user_id', userId).single();
      if (error) {
        // Ignore les erreurs "no rows" ou "not found"
        if (
          error.code === 'PGRST116' ||
          (typeof error.message === 'string' && error.message.toLowerCase().includes('no rows')) ||
          (typeof error.details === 'string' && error.details.toLowerCase().includes('0 rows'))
        ) {
          return null;
        }
        console.error('Failed to load user settings:', error);
        return null;
      }
      return data?.settings || null;
    } catch (error) {
      console.error('Failed to load user settings:', error);
      return null;
    }
  }

  static async exportData(userId: string): Promise<string> {
    const appData = await this.loadAppData(userId);
    const settings = await this.loadUserSettings(userId);

    const exportData = {
      appData,
      settings,
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }

  static async importData(jsonData: string, userId: string): Promise<boolean> {
    try {
      const importData = JSON.parse(jsonData);

      if (importData.appData) {
        await this.saveAppData(importData.appData, userId);
      }

      if (importData.settings) {
        await this.saveUserSettings(importData.settings, userId);
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  static async downloadData(userId: string): Promise<void> {
    const data = await this.exportData(userId);
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

  static async uploadData(file: File, userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const success = await this.importData(content, userId);
        resolve(success);
      };
      reader.readAsText(file);
    });
  }
}

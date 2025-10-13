import { supabase } from '../supabaseClient';

export class AppDataService {
  static async loadAppData(userId: string) {
    const { data, error } = await supabase.from('app_data').select('data').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.data || null;
  }

  static async saveAppData(userId: string, appData: any) {
    // Upsert (insert or update)
    const { error } = await supabase.from('app_data').upsert({ user_id: userId, data: appData });
    if (error) throw error;
  }
}
import { supabase } from '../supabaseClient';

export class AuthService {
  static async register(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw error;
    return data.user;
  }

  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  static async logout() {
    await supabase.auth.signOut();
  }

  static async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
}
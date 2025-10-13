import { supabase } from '../supabaseClient';

export class PaymentService {
  static async addPayment(payment: any) {
    const { data, error } = await supabase.from('payments').insert([payment]);
    if (error) throw error;
    return data;
  }

  static async getPayments(userId: string) {
    const { data, error } = await supabase.from('payments').select('*').eq('user_id', userId).order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async deletePayment(paymentId: string) {
    const { error } = await supabase.from('payments').delete().eq('id', paymentId);
    if (error) throw error;
  }
}
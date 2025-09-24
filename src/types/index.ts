// Core types for Ḥuqúqu’lláh Assistant

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
  isEssential: boolean;
  recurring?: {
    frequency: 'monthly' | 'quarterly' | 'yearly';
    endDate?: Date;
  };
  attachments?: string[]; // File paths or URLs
}

export interface Payment {
  id: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GOLD';
  goldAmount?: number; // Amount in mithqāl
  method: 'cash' | 'bank' | 'gold';
  date: Date;
  note?: string;
  receipt?: string; // PDF receipt path
}

export interface SurplusCalculation {
  totalIncome: number;
  totalExpenses: number;
  essentialExpenses: number;
  nonEssentialExpenses: number;
  surplus: number;
  huquqAmount: number; // 19% of surplus
  remainingAmount: number; // After deducting payments
  period: {
    start: Date;
    end: Date;
  };
}

export interface PaymentPlan {
  id: string;
  totalAmount: number;
  currency: 'USD' | 'EUR' | 'GOLD';
  frequency: 'monthly' | 'quarterly' | 'yearly';
  numberOfPayments: number;
  startDate: Date;
  payments: Payment[];
  completed: boolean;
}

export interface GoldPrice {
  price: number; // Price per gram in base currency
  currency: 'USD' | 'EUR';
  timestamp: Date;
  source: string;
}

export interface UserSettings {
  language: 'fr' | 'en' | 'ar';
  currency: 'USD' | 'EUR';
  goldUnit: 'mithqal' | 'gram' | 'tola';
  mithqalToGram: number; // Conversion factor (default: 4.25)
  essentialCategories: string[];
  notifications: {
    enabled: boolean;
    paymentReminders: boolean;
    goldPriceAlerts: boolean;
    goldPriceThreshold?: number;
  };
  security: {
    pinEnabled: boolean;
    pin?: string;
    biometricEnabled: boolean;
  };
}

export interface AppData {
  transactions: Transaction[];
  payments: Payment[];
  paymentPlans: PaymentPlan[];
  settings: UserSettings;
  lastCalculation?: SurplusCalculation;
  lastSync?: Date;
}

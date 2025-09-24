// Constants for Ḥuqúqu’lláh Assistant

export const HUQUQ_PERCENTAGE = 0.19; // 19%

export const DEFAULT_MITHQAL_TO_GRAM = 4.25;

export const DEFAULT_ESSENTIAL_CATEGORIES = [
  'Logement',
  'Nourriture',
  'Santé',
  'Éducation',
  'Transport',
  'Dettes prioritaires',
  'Services publics'
];

export const EXPENSE_CATEGORIES = [
  'Logement',
  'Nourriture',
  'Santé',
  'Éducation',
  'Transport',
  'Loisirs',
  'Shopping',
  'Services publics',
  'Assurance',
  'Dettes',
  'Dons',
  'Autres'
];

export const INCOME_CATEGORIES = [
  'Salaire',
  'Revenus d\'investissement',
  'Revenus locatifs',
  'Freelance',
  'Primes',
  'Autres revenus'
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces' },
  { value: 'bank', label: 'Virement bancaire' },
  { value: 'gold', label: 'Or physique' }
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' }
];

export const GOLD_UNITS = [
  { value: 'mithqal', label: 'Mithqāl', conversion: 1 },
  { value: 'gram', label: 'Gramme', conversion: 1 / DEFAULT_MITHQAL_TO_GRAM },
  { value: 'tola', label: 'Tola', conversion: 1 / 11.6638 } // 1 tola = 11.6638 grams
];

export const FREQUENCIES = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'yearly', label: 'Annuel' }
];

export const STORAGE_KEYS = {
  APP_DATA: 'huquq_app_data',
  USER_SETTINGS: 'huquq_user_settings',
  ENCRYPTION_KEY: 'huquq_encryption_key'
};

export const API_ENDPOINTS = {
  GOLD_PRICE: 'https://api.goldprice.org/v1/spot'
};

export const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

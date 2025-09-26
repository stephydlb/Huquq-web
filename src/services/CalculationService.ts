import type { Transaction, SurplusCalculation, Payment, GoldPrice } from '../types';
import { HUQUQ_PERCENTAGE, DEFAULT_MITHQAL_TO_GRAM } from '../utils/constants';

export class CalculationService {
  /**
   * Calculate surplus based on transactions
   */
  static calculateSurplus(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    essentialCategories: string[]
  ): SurplusCalculation {
    const periodTransactions = transactions.filter(
      t => t.date >= startDate && t.date <= endDate
    );

    const totalIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const essentialExpenses = periodTransactions
      .filter(t => t.type === 'expense' && essentialCategories.includes(t.category))
      .reduce((sum, t) => sum + t.amount, 0);

    const nonEssentialExpenses = totalExpenses - essentialExpenses;
    const surplus = totalIncome - essentialExpenses;
    const huquqAmount = surplus > 0 ? surplus * HUQUQ_PERCENTAGE : 0;

    return {
      totalIncome,
      totalExpenses,
      essentialExpenses,
      nonEssentialExpenses,
      surplus,
      huquqAmount,
      remainingAmount: huquqAmount,
      period: { start: startDate, end: endDate }
    };
  }

  /**
   * Update remaining amount after payments
   */
  static updateRemainingAmount(
    calculation: SurplusCalculation,
    payments: Payment[]
  ): SurplusCalculation {
    const totalPaid = payments
      .filter(p => p.currency !== 'GOLD') // Only count monetary payments for now
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      ...calculation,
      remainingAmount: Math.max(0, calculation.huquqAmount - totalPaid)
    };
  }

  /**
   * Convert amount to gold equivalent
   */
  static convertToGold(
    amount: number,
    goldPrice: GoldPrice,
    mithqalToGram: number = DEFAULT_MITHQAL_TO_GRAM
  ): number {
    // Convert to grams first
    const grams = amount / goldPrice.price;

    // Convert to mithqāl
    const mithqal = grams / mithqalToGram;

    return mithqal;
  }

  /**
   * Convert gold amount to currency
   */
  static convertFromGold(
    goldAmount: number,
    unit: 'mithqal' | 'gram' | 'tola',
    goldPrice: GoldPrice,
    mithqalToGram: number = DEFAULT_MITHQAL_TO_GRAM
  ): number {
    let grams: number;

    switch (unit) {
      case 'mithqal':
        grams = goldAmount * mithqalToGram;
        break;
      case 'gram':
        grams = goldAmount;
        break;
      case 'tola':
        grams = goldAmount * 11.6638; // 1 tola = 11.6638 grams
        break;
      default:
        grams = goldAmount * mithqalToGram;
    }

    return grams * goldPrice.price;
  }

  /**
   * Calculate payment plan installments
   */
  static calculatePaymentPlan(
    totalAmount: number,
    frequency: 'monthly' | 'quarterly' | 'yearly',
    numberOfPayments: number,
    startDate: Date
  ): { installmentAmount: number; schedule: Date[] } {
    const installmentAmount = totalAmount / numberOfPayments;

    const schedule: Date[] = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < numberOfPayments; i++) {
      schedule.push(new Date(currentDate));

      switch (frequency) {
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'quarterly':
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    return { installmentAmount, schedule };
  }

  /**
   * Get current period (month, quarter, or year)
   */
  static getCurrentPeriod(type: 'month' | 'quarter' | 'year' = 'month'): { start: Date; end: Date } {
    const now = new Date();

    switch (type) {
      case 'month':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        };
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        return {
          start: new Date(now.getFullYear(), quarterStart, 1),
          end: new Date(now.getFullYear(), quarterStart + 3, 0)
        };
      case 'year':
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear(), 11, 31)
        };
      default:
        return this.getCurrentPeriod('month');
    }
  }

  /**
   * Calculate total assets and liabilities
   */
  static calculateNetWorth(transactions: Transaction[]): {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  } {
    const assets = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const liabilities = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalAssets: assets,
      totalLiabilities: liabilities,
      netWorth: assets - liabilities
    };
  }
}

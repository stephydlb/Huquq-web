import type { GoldPrice } from '../types';

export class GoldPriceService {
  private static cache: Map<string, GoldPrice> = new Map();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch current gold price from API
   */
  static async fetchGoldPrice(currency: 'USD' | 'EUR' = 'USD'): Promise<GoldPrice | null> {
    try {
      // Check cache first
      const cacheKey = `gold_${currency}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp.getTime() < this.CACHE_DURATION) {
        return cached;
      }

      // For demo purposes, we'll use a mock API response
      // In production, replace with actual API call
      const mockPrice = this.getMockGoldPrice(currency);

      this.cache.set(cacheKey, mockPrice);
      return mockPrice;
    } catch (error) {
      console.error('Failed to fetch gold price:', error);
      return null;
    }
  }

  /**
   * Get mock gold price for demo purposes
   */
  private static getMockGoldPrice(currency: 'USD' | 'EUR'): GoldPrice {
    // Mock price generation with some variation
    const basePrice = currency === 'USD' ? 65.00 : 60.00; // Base price per gram
    const variation = (Math.random() - 0.5) * 2; // ±1 variation
    const price = basePrice + variation;

    return {
      price: Math.round(price * 100) / 100,
      currency,
      timestamp: new Date(),
      source: 'Demo API'
    };
  }

  /**
   * Get historical gold prices (mock data)
   */
  static getHistoricalPrices(currency: 'USD' | 'EUR', days: number = 30): GoldPrice[] {
    const prices: GoldPrice[] = [];
    const basePrice = currency === 'USD' ? 65.00 : 60.00;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const variation = (Math.random() - 0.5) * 4; // ±2 variation for historical data
      const price = basePrice + variation;

      prices.push({
        price: Math.round(price * 100) / 100,
        currency,
        timestamp: date,
        source: 'Historical Data'
      });
    }

    return prices;
  }

  /**
   * Calculate average gold price over a period
   */
  static calculateAveragePrice(prices: GoldPrice[]): number {
    if (prices.length === 0) return 0;

    const sum = prices.reduce((acc, price) => acc + price.price, 0);
    return Math.round((sum / prices.length) * 100) / 100;
  }

  /**
   * Get price change percentage
   */
  static getPriceChange(currentPrice: number, previousPrice: number): number {
    if (previousPrice === 0) return 0;
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    this.cache.clear();
  }
}

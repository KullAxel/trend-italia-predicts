const FINNHUB_API_KEY = 'd1qms11r01qo4qd8870gd1qms11r01qo4qd88710';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface FinnhubAsset {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

export interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high price of the day
  l: number; // low price of the day
  o: number; // open price of the day
  pc: number; // previous close price
  t: number; // timestamp
}

class FinnhubService {
  private apiKey = FINNHUB_API_KEY;
  private baseUrl = FINNHUB_BASE_URL;

  async searchAssets(query: string): Promise<FinnhubAsset[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?q=${encodeURIComponent(query)}&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search assets');
      }
      
      const data = await response.json();
      
      return data.result?.map((asset: any) => ({
        symbol: asset.symbol,
        description: asset.description,
        displaySymbol: asset.displaySymbol,
        type: asset.type === 'Common Stock' ? 'stock' : 'stock'
      })) || [];
    } catch (error) {
      console.error('Error searching assets:', error);
      return [];
    }
  }

  async getQuote(symbol: string): Promise<FinnhubQuote | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      
      const data = await response.json();
      
      if (data.c === 0) {
        return null; // Invalid symbol or no data
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching quote:', error);
      return null;
    }
  }

  async getCryptoQuote(symbol: string): Promise<FinnhubQuote | null> {
    try {
      // For crypto, we need to add exchange prefix
      const cryptoSymbol = `BINANCE:${symbol}USDT`;
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${cryptoSymbol}&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto quote');
      }
      
      const data = await response.json();
      
      if (data.c === 0) {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching crypto quote:', error);
      return null;
    }
  }
}

export const finnhubService = new FinnhubService();
/**
 * CoinGecko SDK Singleton Client
 * 
 * This module provides a singleton instance of the CoinGecko API client
 * configured with environment variables and retry logic.
 */

import { Coingecko } from '@coingecko/coingecko-typescript';

// Initialize the CoinGecko client as a singleton (server-side only)
const coinGeckoClient = new Coingecko({
  demoAPIKey: process.env.COIN_GECKO_API_KEY || '',
  environment: 'demo',
  maxRetries: 3,
});

// Export the singleton instance
export const coinGecko = coinGeckoClient;

// Re-export types for convenience
export type { Coingecko } from '@coingecko/coingecko-typescript';

/**
 * Next.js Route Handler - Crypto Prices API
 * 
 * This server-side API route acts as a proxy to CoinGecko,
 * keeping the API key secure and never exposing it to the client.
 * 
 * UPDATED: Added in-memory cache to reduce API calls and improve performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { coinGecko } from '@/lib/coingecko';

// In-memory cache
const priceCache = new Map<string, { data: Record<string, number>; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

export async function GET(request: NextRequest) {
  try {
    // Get coin IDs from query parameters
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json(
        { error: 'Missing required parameter: ids' },
        { status: 400 }
      );
    }

    const cacheKey = ids;
    const now = Date.now();

    // Check cache first
    const cached = priceCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      console.log(`[Cache HIT] Prices for: ${ids.substring(0, 50)}...`);
      return NextResponse.json(cached.data);
    }

    console.log(`[Cache MISS] Fetching prices for: ${ids.substring(0, 50)}...`);
    const startTime = Date.now();

    // Fetch prices from CoinGecko using the server-side SDK client
    const response = await coinGecko.simple.price.get({
      ids: ids,
      vs_currencies: 'usd',
    });

    const fetchTime = Date.now() - startTime;
    console.log(`[CoinGecko API] Fetched in ${fetchTime}ms`);

    // Transform response to a more usable format
    const prices: Record<string, number> = {};
    const coinIds = ids.split(',');
    
    for (const coinId of coinIds) {
      if (response[coinId]?.usd !== undefined) {
        prices[coinId] = response[coinId].usd;
      }
    }

    // Store in cache
    priceCache.set(cacheKey, { data: prices, timestamp: now });

    // Clean old cache entries (simple cleanup)
    if (priceCache.size > 100) {
      const entries = Array.from(priceCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      // Remove oldest 20 entries
      for (let i = 0; i < 20; i++) {
        priceCache.delete(entries[i][0]);
      }
    }

    return NextResponse.json(prices);
  } catch (error) {
    console.error('CoinGecko API Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch crypto prices' },
      { status: 500 }
    );
  }
}


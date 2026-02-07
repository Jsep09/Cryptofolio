/**
 * Next.js Route Handler - Crypto Prices API
 * 
 * This server-side API route acts as a proxy to CoinGecko,
 * keeping the API key secure and never exposing it to the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { coinGecko } from '@/lib/coingecko';

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

    // Fetch prices from CoinGecko using the server-side SDK client
    const response = await coinGecko.simple.price.get({
      ids: ids,
      vs_currencies: 'usd',
    });

    // Transform response to a more usable format
    const prices: Record<string, number> = {};
    const coinIds = ids.split(',');
    
    for (const coinId of coinIds) {
      if (response[coinId]?.usd !== undefined) {
        prices[coinId] = response[coinId].usd;
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


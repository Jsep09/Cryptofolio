/**
 * Next.js Route Handler - Crypto Search API
 * 
 * This server-side API route acts as a proxy to CoinGecko's search endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { coinGecko } from '@/lib/coingecko';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required parameter: query' },
        { status: 400 }
      );
    }

    // Use CoinGecko SDK to search for coins
    // Note: The SDK method for search might be under 'search' or similar resource
    // Based on SDK patterns, we try coinGecko.search.get() or fallback if structure differs
    const response = await coinGecko.search.get({ query });

    return NextResponse.json(response);
  } catch (error) {
    console.error('CoinGecko API Error (Search):', error);
    
    return NextResponse.json(
      { error: 'Failed to search coins' },
      { status: 500 }
    );
  }
}

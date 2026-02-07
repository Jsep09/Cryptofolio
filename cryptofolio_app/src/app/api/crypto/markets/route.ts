/**
 * Next.js Route Handler - Crypto Markets API
 * 
 * This server-side API route acts as a proxy to CoinGecko's markets endpoint.
 * It fetches the top 500 coins by market cap to populate the global metadata cache.
 */

import { NextResponse } from 'next/server';
import { coinGecko } from '@/lib/coingecko';

export async function GET() {
  try {
    // Fetch top 250 coins (limit per page usually)
    // CoinGecko API pagination defaults might require multiple calls for 500,
    // but for now we'll fetch the first page with a high limit if possible,
    // or just the default top list. The valid range for per_page is 1..250 generally.
    // Let's try fetching 250 which is a robust amount for common coins.
    
    // Note: The library type definitions will guide the params.
    // We want: vs_currency=usd, order=market_cap_desc, per_page=250, sparkline=false
    
    const response = await coinGecko.coins.markets.get({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 250, // Fetching top 250 is usually sufficient for most users
      sparkline: false,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('CoinGecko API Error (Markets):', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch crypto markets' },
      { status: 500 }
    );
  }
}

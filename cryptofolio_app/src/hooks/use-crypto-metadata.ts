import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface CoinMetadata {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
}

const METADATA_QUERY_KEY = ['crypto-metadata'];
const STALE_TIME = 1000 * 60 * 60 * 24; // 24 hours

export function useCryptoMetadata() {
  const { data: coins, isLoading, error } = useQuery<CoinMetadata[]>({
    queryKey: METADATA_QUERY_KEY,
    queryFn: async () => {
      console.time('⏱️ Fetch Crypto Metadata');
      const response = await fetch('/api/crypto/markets');
      if (!response.ok) {
        throw new Error('Failed to fetch crypto metadata');
      }
      const data = await response.json();
      console.timeEnd('⏱️ Fetch Crypto Metadata');
      return data;
    },
    staleTime: STALE_TIME,
    gcTime: STALE_TIME, // Keep in cache for 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Create Maps for O(1) lookup instead of O(n) array.find()
  const coinMaps = useMemo(() => {
    if (!coins) return { byId: new Map(), bySymbol: new Map() };
    
    console.time('⏱️ Build Coin Maps');
    const byId = new Map<string, CoinMetadata>();
    const bySymbol = new Map<string, CoinMetadata>();
    
    coins.forEach((coin) => {
      byId.set(coin.id, coin);
      bySymbol.set(coin.symbol.toLowerCase(), coin);
    });
    
    console.timeEnd('⏱️ Build Coin Maps');
    return { byId, bySymbol };
  }, [coins]);

  // Memoized lookup functions (O(1) instead of O(n))
  const getCoinBySymbol = useMemo(() => {
    return (symbol: string): CoinMetadata | undefined => {
      return coinMaps.bySymbol.get(symbol.toLowerCase());
    };
  }, [coinMaps]);

  const getCoinById = useMemo(() => {
    return (id: string): CoinMetadata | undefined => {
      return coinMaps.byId.get(id);
    };
  }, [coinMaps]);

  return {
    coins,
    isLoading,
    error,
    getCoinBySymbol,
    getCoinById,
  };
}

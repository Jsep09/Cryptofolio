import { useQuery } from '@tanstack/react-query';

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
      const response = await fetch('/api/crypto/markets');
      if (!response.ok) {
        throw new Error('Failed to fetch crypto metadata');
      }
      return response.json();
    },
    staleTime: STALE_TIME,
    gcTime: STALE_TIME, // Keep in cache for 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const getCoinBySymbol = (symbol: string): CoinMetadata | undefined => {
    if (!coins) return undefined;
    const normalizedSymbol = symbol.toLowerCase();
    return coins.find((c) => c.symbol.toLowerCase() === normalizedSymbol);
  };

  const getCoinById = (id: string): CoinMetadata | undefined => {
    if (!coins) return undefined;
    return coins.find((c) => c.id === id);
  };

  return {
    coins,
    isLoading,
    error,
    getCoinBySymbol,
    getCoinById,
  };
}

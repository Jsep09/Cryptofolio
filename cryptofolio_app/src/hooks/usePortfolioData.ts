"use client";

/**
 * Portfolio Data Hook
 * 
 * Fetches crypto prices from our secure server-side API route
 * and calculates portfolio metrics using Zustand transaction data.
 * 
 * UPDATED: Now supports fetching transactions from Supabase if logged in.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTransactionStore, Transaction } from '@/store/transactionStore';
import { useAuth } from '@/components/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo } from 'react';

interface AssetData {
  coinId: string;
  symbol: string;
  totalAmount: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  plAmount: number;
  plPercent: number;
  portfolioShare: number;
}

interface PortfolioData {
  totalMarketValue: number;
  totalCostBasis: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  assets: AssetData[];
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => void;
  error: Error | null;
  lastUpdated: Date | null;
}

export function usePortfolioData(): PortfolioData {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();
  
  const transactions = useTransactionStore((state) => state.transactions);
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const getUniqueCoinIds = useTransactionStore((state) => state.getUniqueCoinIds);

  // 1. Fetch transactions from Supabase if logged in
  const { data: dbTransactions, isLoading: isDbLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.time('⏱️ Fetch Transactions (Supabase)');
      const { data, error } = await supabase
        .from('transactions')
        .select('*');
      console.timeEnd('⏱️ Fetch Transactions (Supabase)');
        
      if (error) throw error;
      
      // Map DB fields (snake_case) to Transaction interface (camelCase)
      return (data || []).map((t: any) => ({
        id: t.id,
        symbol: t.symbol,
        coinId: t.coin_id,
        amount: Number(t.amount),
        costPerUnit: Number(t.cost_per_unit),
        date: t.date,
      })) as Transaction[];
    },
    enabled: !!user,
  });

  // 2. Sync DB transactions to Store
  useEffect(() => {
    if (user && dbTransactions) {
      setTransactions(dbTransactions);
    }
  }, [user, dbTransactions, setTransactions]);

  const coinIds = getUniqueCoinIds();

  // 3. Fetch live prices
  const { data: priceData, isLoading: isPriceLoading, isRefetching, refetch, error } = useQuery({
    queryKey: ['crypto-prices', coinIds],
    queryFn: async () => {
      if (coinIds.length === 0) {
        return {};
      }

      try {
        console.time('⏱️ Fetch Prices (CoinGecko API)');
        const response = await fetch(
          `/api/crypto/prices?ids=${coinIds.join(',')}`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const prices: Record<string, number> = await response.json();
        console.timeEnd('⏱️ Fetch Prices (CoinGecko API)');
        return prices;
      } catch (err) {
        console.error('Failed to fetch crypto prices:', err);
        throw err;
      }
    },
    refetchInterval: 60 * 1000, // 60 seconds
    staleTime: 55 * 1000, // 55 seconds
    enabled: coinIds.length > 0,
  });

  // 4. Calculate portfolio metrics (memoized)
  const portfolioMetrics = useMemo(() => {
    console.time('⏱️ Calculate Portfolio Metrics');
    
    if (!priceData || Object.keys(priceData).length === 0) {
      console.timeEnd('⏱️ Calculate Portfolio Metrics');
      return {
        totalMarketValue: 0,
        totalCostBasis: 0,
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
        assets: [],
      };
    }

    const assetMap = new Map<string, AssetData>();

    transactions.forEach((transaction) => {
      const currentPrice = priceData[transaction.coinId] || 0;
      const transactionValue = transaction.amount * currentPrice;
      const transactionCost = transaction.amount * transaction.costPerUnit;

      if (assetMap.has(transaction.coinId)) {
        const existing = assetMap.get(transaction.coinId)!;
        existing.totalAmount += transaction.amount;
        existing.marketValue += transactionValue;
        existing.costBasis += transactionCost;
      } else {
        assetMap.set(transaction.coinId, {
          coinId: transaction.coinId,
          symbol: transaction.symbol,
          totalAmount: transaction.amount,
          currentPrice,
          marketValue: transactionValue,
          costBasis: transactionCost,
          plAmount: 0, 
          plPercent: 0,
          portfolioShare: 0,
        });
      }
    });

    const assets: AssetData[] = [];
    let totalMarketValue = 0;
    let totalCostBasis = 0;

    assetMap.forEach((asset) => {
      asset.plAmount = asset.marketValue - asset.costBasis;
      asset.plPercent = asset.costBasis > 0 ? (asset.plAmount / asset.costBasis) * 100 : 0;
      
      totalMarketValue += asset.marketValue;
      totalCostBasis += asset.costBasis;
      
      assets.push(asset);
    });

    assets.sort((a, b) => b.marketValue - a.marketValue);

    const unrealizedPL = totalMarketValue - totalCostBasis;
    const unrealizedPLPercent = totalCostBasis > 0 ? (unrealizedPL / totalCostBasis) * 100 : 0;

    assets.forEach((asset) => {
      if (totalMarketValue > 0) {
        asset.portfolioShare = (asset.marketValue / totalMarketValue) * 100;
      } else {
        asset.portfolioShare = 0;
      }
    });

    console.timeEnd('⏱️ Calculate Portfolio Metrics');
    
    return {
      totalMarketValue,
      totalCostBasis,
      unrealizedPL,
      unrealizedPLPercent,
      assets,
    };
  }, [transactions, priceData]); // Only recalculate when these change

  return {
    ...portfolioMetrics,
    isLoading: user ? (isDbLoading || isPriceLoading) : isPriceLoading, 
    isRefetching,
    refetch,
    error: error as Error | null,
    lastUpdated: priceData ? new Date() : null,
  };
}

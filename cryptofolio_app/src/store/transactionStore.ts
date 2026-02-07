/**
 * Zustand Transaction Store
 * 
 * Manages portfolio transactions with localStorage persistence.
 * Each transaction tracks: id, symbol, coinId, amount, costPerUnit, and date.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  symbol: string;
  coinId: string; // CoinGecko API ID (e.g., 'bitcoin', 'ethereum')
  amount: number;
  costPerUnit: number;
  date: string; // ISO 8601 date string
}

interface TransactionStore {
  transactions: Transaction[];
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  clearAllTransactions: () => void;
  
  // Computed getters
  getUniqueCoinIds: () => string[];
  getTransactionsBySymbol: (symbol: string) => Transaction[];
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      // Initial state with sample transactions for testing
      transactions: [
        // {
        //   id: '1',
        //   symbol: 'BTC',
        //   coinId: 'bitcoin',
        //   amount: 0.523,
        //   costPerUnit: 45000,
        //   date: '2024-01-15T00:00:00.000Z',
        // },
        // {
        //   id: '2',
        //   symbol: 'ETH',
        //   coinId: 'ethereum',
        //   amount: 4.2,
        //   costPerUnit: 2100,
        //   date: '2024-02-10T00:00:00.000Z',
        // },
        // {
        //   id: '3',
        //   symbol: 'SOL',
        //   coinId: 'solana',
        //   amount: 25,
        //   costPerUnit: 95,
        //   date: '2024-03-05T00:00:00.000Z',
        // },
      ],

      // Add a new transaction
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      // Remove a transaction by ID
      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      // Update a transaction
      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }));
      },

      // Clear all transactions
      clearAllTransactions: () => {
        set({ transactions: [] });
      },

      // Get unique coin IDs for API queries
      getUniqueCoinIds: () => {
        const { transactions } = get();
        const uniqueCoinIds = Array.from(
          new Set(transactions.map((t) => t.coinId))
        );
        return uniqueCoinIds;
      },

      // Get transactions by symbol
      getTransactionsBySymbol: (symbol) => {
        const { transactions } = get();
        return transactions.filter((t) => t.symbol === symbol);
      },
    }),
    {
      name: 'cryptofolio-transactions', // localStorage key
    }
  )
);

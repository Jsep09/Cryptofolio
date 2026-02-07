"use client";

import React, { useState, useEffect } from "react";
import { AddTransactionModal } from "./add-transaction-modal";

import {
  Wallet,
  TrendingUp,
  DollarSign,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useTransactionStore } from "@/store/transactionStore";
import { CoinDisplay } from "@/components/coin-display";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ViewTransactionsModal } from "./view-transactions-modal";
import { EditTransactionModal } from "./edit-transaction-modal";
import { Transaction } from "@/store/transactionStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Get live portfolio data
  const {
    totalMarketValue,
    totalCostBasis,
    unrealizedPL,
    unrealizedPLPercent,
    assets,
    isLoading,
    error,
  } = usePortfolioData();

  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);
  
  const [isMounted, setIsMounted] = useState(false);
  const [viewTransactionsModal, setViewTransactionsModal] = useState<{ coinId: string; symbol: string } | null>(null);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteTransaction, setDeleteTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSaveTransaction = async (data: any) => {
    
    if (user) {
      // Save to Supabase
      try {
        const { error } = await supabase.from("transactions").insert({
          user_id: user.id,
          coin_id: data.coinId,
          symbol: data.symbol,
          amount: Number(data.amount),
          cost_per_unit: Number(data.costPerUnit),
          date: data.date,
        });

        if (error) throw error;
        
        // Invalidate query to trigger refetch in usePortfolioData
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        
      } catch (err) {
        console.error("Failed to save transaction:", err);
        // Ideally show a toast error here
      }
    } else {
      // Save to Local Store (Guest mode)
      addTransaction({
        symbol: data.symbol,
        coinId: data.coinId,
        amount: Number(data.amount),
        costPerUnit: Number(data.costPerUnit),
        date: data.date,
      });
    }
    
    setIsModalOpen(false);
  };

  const handleUpdateTransaction = async (id: string, data: { amount: number; costPerUnit: number; date: string }) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("transactions")
          .update({
            amount: data.amount,
            cost_per_unit: data.costPerUnit,
            date: data.date,
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      } catch (err) {
        console.error("Failed to update transaction:", err);
      }
    } else {
      updateTransaction(id, {
        amount: data.amount,
        costPerUnit: data.costPerUnit,
        date: data.date,
      });
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", transaction.id)
          .eq("user_id", user.id);

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      } catch (err) {
        console.error("Failed to delete transaction:", err);
      }
    } else {
      removeTransaction(transaction.id);
    }
    setDeleteTransaction(null);
  };

  return (
    <motion.div
      className="p-6 md:p-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Modals */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />

      <ViewTransactionsModal
        isOpen={!!viewTransactionsModal}
        onClose={() => setViewTransactionsModal(null)}
        coinId={viewTransactionsModal?.coinId || ""}
        symbol={viewTransactionsModal?.symbol || ""}
        onEdit={(transaction) => {
          setViewTransactionsModal(null);
          setEditTransaction(transaction);
        }}
        onDelete={(transaction) => {
          setViewTransactionsModal(null);
          setDeleteTransaction(transaction);
        }}
        onAddNew={() => {
          setViewTransactionsModal(null);
          setIsModalOpen(true);
        }}
      />

      <EditTransactionModal
        isOpen={!!editTransaction}
        onClose={() => setEditTransaction(null)}
        transaction={editTransaction}
        onSave={handleUpdateTransaction}
      />

      <AlertDialog open={!!deleteTransaction} onOpenChange={() => setDeleteTransaction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
              {deleteTransaction && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-mono">{deleteTransaction.amount} {deleteTransaction.symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-mono">${deleteTransaction.costPerUnit.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTransaction && handleDeleteTransaction(deleteTransaction)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Portfolio</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Manage your assets and track performance
        </p>
      </div>

      {/* 1. Top Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Card className="bg-card backdrop-blur-xl border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-4 sm:p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Total Invested
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                {!isMounted || isLoading ? (
                  <span className="text-zinc-600">Loading...</span>
                ) : (
                  <span suppressHydrationWarning>
                    ${totalCostBasis.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-xl border-border relative overflow-hidden group hover:border-primary/20 transition-colors">
             <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign className="w-24 h-24 text-primary" />
             </div>
          <CardContent className="p-6 flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Current Value
              </p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {!isMounted || isLoading ? (
                  <span className="text-zinc-600">Loading...</span>
                ) : (
                  <span suppressHydrationWarning>
                    ${totalMarketValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card backdrop-blur-xl border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Unrealized P/L
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-2xl font-bold font-mono ${
                    unrealizedPL >= 0 ? "text-[#CCFF00]" : "text-red-500"
                  }`}
                >
                  {!isMounted || isLoading ? (
                    <span className="text-zinc-600">...</span>
                  ) : (
                    <span suppressHydrationWarning>
                      {unrealizedPL >= 0 ? "+" : ""}
                      ${Math.abs(unrealizedPL).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  )}
                </p>
                <span
                  className={`text-sm font-medium ${
                    unrealizedPL >= 0 ? "text-[#CCFF00]" : "text-red-500"
                  }`}
                  suppressHydrationWarning
                >
                  {isMounted && !isLoading && `(${unrealizedPLPercent.toFixed(2)}%)`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Management Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground font-mono transition-shadow"
            />
          </div>
          <Button
              variant="outline"
              className="gap-2 border-border bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
          >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-neon-lime text-primary-foreground hover:bg-primary/90 font-bold gap-2 shadow-lg shadow-primary/20 transition-all border-0"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* 3. Asset Table/Cards */}
      <Card className="bg-card backdrop-blur-xl border-border overflow-hidden">
        {/* Desktop Table - hidden on mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Asset</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Balance</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Avg. Buy</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Current Price</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">Total Value</th>
                <th className="px-6 py-4 text-right font-medium text-muted-foreground">P/L</th>
                <th className="px-6 py-4 text-center font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {!isMounted || isLoading ? (
                <>
                  {/* Skeleton Loading */}
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted/50 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted/50 rounded w-24"></div>
                            <div className="h-3 bg-muted/30 rounded w-16"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted/50 rounded w-20 ml-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted/50 rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted/50 rounded w-20 ml-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted/50 rounded w-24 ml-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-muted/50 rounded w-16 ml-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 w-8 bg-muted/50 rounded mx-auto"></div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-red-500">
                    Error loading data: {error.message}
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No assets found. Start by adding your first investment.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => {
                  const avgBuyPrice = asset.totalAmount > 0 ? asset.costBasis / asset.totalAmount : 0;

                  return (
                    <tr
                      key={asset.coinId}
                      className="group transition-colors cursor-pointer hover:bg-muted/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <CoinDisplay 
                            id={asset.coinId}
                            symbol={asset.symbol}
                            showName
                            className="font-bold text-foreground"
                            textClassName="items-start"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-foreground font-medium">
                        {asset.totalAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} {asset.symbol}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                        ${avgBuyPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="font-mono text-foreground font-medium">
                                  ${asset.currentPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                               </span>
                          </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                        ${asset.marketValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex flex-col items-end ${asset.plAmount >= 0 ? "text-[#CCFF00]" : "text-red-500"}`}>
                          <span className="font-bold font-mono">
                            {asset.plAmount >= 0 ? "+" : ""}{asset.plPercent.toFixed(2)}%
                          </span>
                          <span className="text-xs opacity-80 font-mono">
                              {asset.plAmount >= 0 ? "+" : ""}${Math.abs(asset.plAmount).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewTransactionsModal({ coinId: asset.coinId, symbol: asset.symbol })}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                // Delete all transactions for this asset
                                const transactions = useTransactionStore.getState().getTransactionsByCoinId(asset.coinId);
                                if (transactions.length > 0) {
                                  setDeleteTransaction(transactions[0]); // For now, just show first one
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete All
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - hidden on desktop */}
        <div className="md:hidden">
          {!isMounted || isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted/50 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted/50 rounded w-24"></div>
                        <div className="h-3 bg-muted/30 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-muted/50 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-4 bg-muted/50 rounded"></div>
                    <div className="h-4 bg-muted/50 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading data: {error.message}
            </div>
          ) : assets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No assets found. Start by adding your first investment.
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {assets.map((asset) => {
                const avgBuyPrice = asset.totalAmount > 0 ? asset.costBasis / asset.totalAmount : 0;

                return (
                  <Card key={asset.coinId} className="hover:bg-muted/30 transition-colors border-border">
                    <CardContent className="p-4">
                      {/* Header: Coin + Actions */}
                      <div className="flex items-center justify-between mb-3">
                        <CoinDisplay 
                          id={asset.coinId}
                          symbol={asset.symbol}
                          showName
                          className="font-bold text-foreground"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewTransactionsModal({ coinId: asset.coinId, symbol: asset.symbol })}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                const transactions = useTransactionStore.getState().getTransactionsByCoinId(asset.coinId);
                                if (transactions.length > 0) {
                                  setDeleteTransaction(transactions[0]);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete All
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Balance</p>
                          <p className="font-mono font-medium">{asset.totalAmount.toLocaleString("en-US", { maximumFractionDigits: 8 })} {asset.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs mb-1">Value</p>
                          <p className="font-mono font-bold">${asset.marketValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Avg Buy</p>
                          <p className="font-mono text-sm">${avgBuyPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs mb-1">P/L</p>
                          <div className={`${asset.plAmount >= 0 ? 'text-[#CCFF00]' : 'text-red-500'}`}>
                            <p className="font-mono font-bold text-sm">
                              {asset.plAmount >= 0 ? '+' : ''}{asset.plPercent.toFixed(2)}%
                            </p>
                            <p className="font-mono text-xs opacity-80">
                              {asset.plAmount >= 0 ? '+' : ''}${Math.abs(asset.plAmount).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

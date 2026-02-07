"use client";

import React, { useState } from "react";
import { AddTransactionModal } from "./add-transaction-modal";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useTransactionStore } from "@/store/transactionStore";
import { CoinDisplay } from "@/components/coin-display";

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

  return (
    <motion.div
      className="p-6 md:p-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          console.log("Saving transaction:", data);
          setIsModalOpen(false);
        }}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Portfolio</h1>
        <p className="text-muted-foreground text-sm">
          Manage your assets and track performance
        </p>
      </div>

      {/* 1. Top Summary Bar */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card backdrop-blur-xl border-border hover:border-primary/20 transition-colors">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Total Invested
              </p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {isLoading ? (
                  <span className="text-zinc-600">Loading...</span>
                ) : (
                  `$${totalCostBasis.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
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
                {isLoading ? (
                  <span className="text-zinc-600">Loading...</span>
                ) : (
                  `$${totalMarketValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
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
                  {isLoading ? (
                    <span className="text-zinc-600">...</span>
                  ) : (
                    <>
                      {unrealizedPL >= 0 ? "+" : ""}
                      ${Math.abs(unrealizedPL).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </>
                  )}
                </p>
                <span
                  className={`text-sm font-medium ${
                    unrealizedPL >= 0 ? "text-[#CCFF00]" : "text-red-500"
                  }`}
                >
                  {!isLoading && `(${unrealizedPLPercent.toFixed(2)}%)`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Management Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground font-mono transition-shadow"
            />
          </div>
          <div className="relative">
            <Button
                variant="outline"
                className="gap-2 border-border bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
            >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-neon-lime text-primary-foreground hover:bg-primary/90 font-bold gap-2 shadow-lg shadow-primary/20 transition-all border-0"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* 3. Asset Table */}
      <Card className="bg-card backdrop-blur-xl border-border overflow-hidden">
        <div className="overflow-x-auto">
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
            <motion.tbody
              className="divide-y divide-border/30"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Loading portfolio data...
                  </td>
                </tr>
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
                  const avgBuyPrice = asset.costBasis / asset.totalAmount;

                  return (
                    <motion.tr
                      key={asset.coinId}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      className="group transition-colors cursor-pointer"
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </motion.tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

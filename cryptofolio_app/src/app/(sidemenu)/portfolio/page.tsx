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

// --- Mock Data ---
interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  avgBuyPrice: number;
  currentPrice: number;
  type: "Crypto" | "Stock" | "Cash";
}

const mockAssets: Asset[] = [
  {
    id: "1",
    symbol: "BTC",
    name: "Bitcoin",
    balance: 0.523,
    avgBuyPrice: 45000,
    currentPrice: 67234.56,
    type: "Crypto",
  },
  {
    id: "2",
    symbol: "ETH",
    name: "Ethereum",
    balance: 4.2,
    avgBuyPrice: 2100,
    currentPrice: 3456.78,
    type: "Crypto",
  },
  {
    id: "3",
    symbol: "NVDA",
    name: "NVIDIA Corp",
    balance: 50,
    avgBuyPrice: 450,
    currentPrice: 890.12,
    type: "Stock",
  },
  {
    id: "4",
    symbol: "USDT",
    name: "Tether",
    balance: 15400,
    avgBuyPrice: 1,
    currentPrice: 1.0,
    type: "Cash",
  },
];

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

  // Calculations
  const totalCost = mockAssets.reduce(
    (acc, asset) => acc + asset.balance * asset.avgBuyPrice,
    0
  );
  const totalValue = mockAssets.reduce(
    (acc, asset) => acc + asset.balance * asset.currentPrice,
    0
  );
  const unrealizedPL = totalValue - totalCost;
  const unrealizedPLPercent = (unrealizedPL / totalCost) * 100;

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
                ${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
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
                ${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
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
                    unrealizedPL >= 0 ? "text-emerald-500" : "text-red-500" // Serious Green/Red
                  }`}
                >
                  {unrealizedPL >= 0 ? "+" : ""}
                  ${Math.abs(unrealizedPL).toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </p>
                <span
                  className={`text-sm font-medium ${
                    unrealizedPL >= 0 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  ({unrealizedPLPercent.toFixed(2)}%)
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
          Add Asset
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
              {mockAssets.map((asset) => {
                const totalAssetValue = asset.balance * asset.currentPrice;
                const totalBuyCost = asset.balance * asset.avgBuyPrice;
                const pl = totalAssetValue - totalBuyCost;
                const plPercent = (pl / totalBuyCost) * 100;

                return (
                  <motion.tr
                    key={asset.id}
                    variants={itemVariants} // Staggered entry
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    className="group transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-foreground border border-border">
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{asset.symbol}</p>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-foreground font-medium">
                      {asset.balance.toLocaleString("en-US")} {asset.symbol}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                      ${asset.avgBuyPrice.toLocaleString("en-US")}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="font-mono text-foreground font-medium">
                                ${asset.currentPrice.toLocaleString("en-US")}
                             </span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                      ${totalAssetValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex flex-col items-end ${pl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        <span className="font-bold font-mono">
                          {pl >= 0 ? "+" : ""}{plPercent.toFixed(2)}%
                        </span>
                        <span className="text-xs opacity-80 font-mono">
                            {pl >= 0 ? "+" : ""}${Math.abs(pl).toLocaleString("en-US", { maximumFractionDigits: 2 })}
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
              })}
            </motion.tbody>
          </table>
          {mockAssets.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              No assets found. Start by adding your first investment.
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

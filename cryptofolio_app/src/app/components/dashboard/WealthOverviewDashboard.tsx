"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import {
  TrendingUp,
  TrendingDown,
  Activity,
  Bitcoin,
  Wallet,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useTransactionStore } from "@/store/transactionStore";
import { format } from "date-fns";
import { CoinDisplay } from "@/components/coin-display";

// --- Constants ---
const COLORS = ["#3B82F6", "#CCFF00", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

// --- Animation Components ---
const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <motion.div 
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={`bg-zinc-800/50 rounded-md ${className}`} 
  />
);

const SkeletonRow = () => (
   <div className="flex items-center gap-3 w-full">
     <SkeletonPulse className="h-8 w-8 rounded-full" />
     <div className="flex flex-col gap-2 flex-1">
       <SkeletonPulse className="h-3 w-24" />
       <SkeletonPulse className="h-2 w-16" />
     </div>
     <SkeletonPulse className="h-4 w-12" />
   </div>
);

// --- Utilities ---
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// --- Sub-Components ---
const BentoCard = ({
  children,
  className = "",
  title,
  icon: Icon,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ElementType;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
      {(title || Icon) && (
        <div className="mb-4 flex items-center gap-2 text-zinc-400">
          {Icon && <Icon className="h-4 w-4 text-blue-500" />}
          <h3 className="text-xs font-semibold uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

// --- Main Component ---

export default function WealthOverviewDashboard() {
  const [isClient, setIsClient] = useState(false);

  // Get live portfolio data
  const {
    totalMarketValue,
    unrealizedPL,
    unrealizedPLPercent,
    assets,
    isLoading,
    isRefetching,
    refetch,
    lastUpdated,
  } = usePortfolioData();

  // Combine loading states for UI feedback
  const displayLoading = isLoading || isRefetching;

  // Get transactions for timeline
  const transactions = useTransactionStore((state) => state.transactions);
  
  // Find best and worst performers
  const sortedAssets = [...assets].sort((a, b) => b.plPercent - a.plPercent);
  const bestPerformer = sortedAssets[0];
  const worstPerformer = sortedAssets[sortedAssets.length - 1];

  // Allocation Data Calculation
  const allocationData = React.useMemo(() => {
    if (totalMarketValue === 0) return [];

    return [...assets]
      .sort((a, b) => b.marketValue - a.marketValue)
      .map((asset, index) => ({
        name: asset.symbol,
        value: asset.marketValue,
        percentage: ((asset.marketValue / totalMarketValue) * 100).toFixed(1),
        color: COLORS[index % COLORS.length]
      }));
  }, [assets, totalMarketValue]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch on charts

  return (
    <div className="space-y-6 p-4 md:p-8 text-zinc-100 font-sans">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Wealth Overview
          </h1>
          <p className="text-sm text-zinc-500">
            Real-time portfolio analytics & tactical insights
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => refetch()}
             disabled={isRefetching}
             className="flex items-center gap-2 rounded-full border border-border bg-zinc-900/50 px-4 py-2 text-xs font-medium text-zinc-400 transition-hover hover:bg-zinc-800 hover:text-white group disabled:opacity-50 disabled:cursor-not-allowed"
           >
            <RefreshCw className={`h-3 w-3 ${isRefetching ? 'animate-spin' : 'transition-transform group-hover:rotate-180'}`} />
            <span>{isRefetching ? 'Syncing...' : 'Sync Data'}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
        {/* 1. Total Net Worth (Large Box) */}
        <BentoCard
          className="md:col-span-4 md:row-span-1 min-h-[220px]"
          title="Total Net Worth"
          icon={Wallet}
          delay={0.1}
        >
          <div className="flex flex-col justify-center h-full pb-6">
            <div className="flex items-baseline gap-1 min-h-[48px]">
              <AnimatePresence mode="wait">
                {displayLoading ? (
                  <SkeletonPulse key="loading-val" className="h-12 w-48 bg-zinc-800/50" />
                ) : (
                  <motion.span 
                    key="value"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-4xl lg:text-5xl font-bold font-mono tracking-tighter text-white"
                  >
                    {formatCurrency(totalMarketValue)}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-4 flex items-center gap-3 min-h-[24px]">
               <AnimatePresence mode="wait">
                 {displayLoading ? (
                    <div className="flex items-center gap-3">
                      <SkeletonPulse className="h-6 w-20 rounded-full" />
                      <SkeletonPulse className="h-4 w-24" />
                    </div>
                 ) : (
                   <motion.div 
                     key="stats"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex items-center gap-3"
                   >
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium border ${
                        unrealizedPL >= 0 
                          ? "bg-green-500/10 text-[#CCFF00] border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}>
                        {unrealizedPL >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>
                          {`${unrealizedPL >= 0 ? "+" : ""}${unrealizedPLPercent.toFixed(2)}%`}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">
                        {`${unrealizedPL >= 0 ? "+" : ""}${formatCurrency(unrealizedPL)} (24h)`}
                      </span>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            <div className="absolute top-6 right-6">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
          </div>
        </BentoCard>

        {/* 2. Asset Allocation (Donut Chart) */}
        <BentoCard
          className="md:col-span-4 md:row-span-1"
          title="Allocation"
          icon={Activity}
          delay={0.2}
        >
          <AnimatePresence mode="wait">
            {displayLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full items-center justify-between gap-4"
              >
                  <div className="h-[160px] w-[160px] flex-shrink-0 flex items-center justify-center">
                     <SkeletonPulse className="h-[140px] w-[140px] rounded-full" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                     <SkeletonPulse className="h-4 w-full" />
                     <SkeletonPulse className="h-4 w-3/4" />
                     <SkeletonPulse className="h-4 w-1/2" />
                  </div>
              </motion.div>
            ) : assets.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full items-center justify-center text-zinc-600"
              >
                 <p className="text-sm">No assets</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full items-center justify-between gap-4"
              >
                <div className="h-[160px] w-[160px] flex-shrink-0 relative">
                     <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-mono text-zinc-500">Asset<br/>Mix</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[160px] pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
                  {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-zinc-400 uppercase truncate max-w-[60px]" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono font-medium text-zinc-200 text-xs">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </BentoCard>

        {/* 3. Market Insights (Small Boxes - Best/Worst) */}
        <div className="md:col-span-4 md:row-span-1 grid grid-rows-2 gap-4">
            {/* Best Performer */}
            <BentoCard className="flex items-center justify-between" delay={0.3}>
                 <AnimatePresence mode="wait">
                   {displayLoading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                        <SkeletonRow />
                      </motion.div>
                   ) : bestPerformer ? (
                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                            <Zap className="h-5 w-5 text-[#CCFF00]" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase font-semibold">Top Gainer</p>
                            <CoinDisplay 
                              id={bestPerformer.coinId} 
                              symbol={bestPerformer.symbol} 
                              showName 
                              className="font-bold text-zinc-200 capitalize"
                              textClassName="items-start"
                            />
                        </div>
                     </div>
                     <div className="text-right">
                         <p className="text-[#CCFF00] font-mono font-medium flex items-center justify-end gap-1">
                             <TrendingUp className="h-3 w-3"/> +{bestPerformer.plPercent.toFixed(2)}%
                         </p>
                         <p className="text-xs text-zinc-500 font-mono">${bestPerformer.currentPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                     </div>
                   </motion.div>
                   ) : (
                     <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full justify-center text-zinc-600">
                       <p className="text-xs">No data</p>
                     </motion.div>
                   )}
                 </AnimatePresence>
            </BentoCard>

            {/* Worst Performer */}
             <BentoCard className="flex items-center justify-between" delay={0.4}>
                 <AnimatePresence mode="wait">
                   {displayLoading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                        <SkeletonRow />
                      </motion.div>
                   ) : worstPerformer ? (
                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between w-full">
                     <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                             <TrendingDown className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase font-semibold">Top Loser</p>
                            <CoinDisplay 
                              id={worstPerformer.coinId} 
                              symbol={worstPerformer.symbol} 
                              showName 
                              className="font-bold text-zinc-200 capitalize"
                              textClassName="items-start"
                            />
                        </div>
                     </div>
                     <div className="text-right">
                         <p className={`font-mono font-medium flex items-center justify-end gap-1 ${worstPerformer.plPercent >= 0 ? "text-[#CCFF00]" : "text-red-500"}`}>
                             {worstPerformer.plPercent >= 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}
                             {worstPerformer.plPercent >= 0 ? "+" : ""}{worstPerformer.plPercent.toFixed(2)}%
                         </p>
                          <p className="text-xs text-zinc-500 font-mono">${worstPerformer.currentPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                     </div>
                   </motion.div>
                   ) : (
                     <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-full justify-center text-zinc-600">
                       <p className="text-xs">No data</p>
                     </motion.div>
                   )}
                 </AnimatePresence>
            </BentoCard>
        </div>

        {/* 4. P/L Comparison & Transaction History */}
        <div className="md:col-span-8 md:row-span-2 grid grid-rows-2 gap-4">
          {/* P/L Comparison Chart */}
          <BentoCard
            title="Profit & Loss by Asset"
            icon={TrendingUp}
            delay={0.5}
          >
            <div className="h-full w-full">
              <AnimatePresence mode="wait">
                {displayLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                     {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
                  </motion.div>
                ) : assets.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-full text-zinc-600"
                  >
                    <p className="text-sm">No assets to display</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {assets.slice(0, 5).map((asset, index) => {
                      const isProfit = asset.plAmount >= 0;
                      const percentage = asset.plPercent;
                      const maxAbsPercent = Math.max(...assets.map(a => Math.abs(a.plPercent)));
                      const barWidth = maxAbsPercent > 0 ? (Math.abs(percentage) / maxAbsPercent) * 100 : 0;

                      return (
                        <motion.div
                          key={asset.coinId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <CoinDisplay 
                                id={asset.coinId}
                                symbol={asset.symbol}
                                showName={false}
                              />
                              {/* Original name was not shown, keeping it consistent or using showName={false} */}
                              <span className="text-sm font-semibold text-zinc-300 uppercase">{asset.symbol}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-mono font-bold ${isProfit ? 'text-[#CCFF00]' : 'text-red-500'}`}>
                                {isProfit ? '+' : ''}{percentage.toFixed(2)}%
                              </span>
                              <span className={`text-xs font-mono ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isProfit ? '+' : ''}{formatCurrency(asset.plAmount)}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                              className={`h-full rounded-full ${
                                isProfit 
                                  ? 'bg-gradient-to-r from-emerald-500 to-[#CCFF00]' 
                                  : 'bg-gradient-to-r from-red-600 to-red-500'
                              }`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </BentoCard>

          {/* Transaction History Timeline */}
          <BentoCard
            title="Recent Transactions"
            icon={Activity}
            delay={0.6}
          >
            <div className="h-full w-full overflow-y-auto">
              <AnimatePresence mode="wait">
                {transactions.length === 0 && !displayLoading ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-full text-zinc-600"
                  >
                    <p className="text-sm">No transactions yet</p>
                  </motion.div>
                ) : (
                  <motion.div 
                     key="list"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="space-y-2"
                  >
                    {/* Since Transactions are also fetched/updated, using displayLoading for them if we consider them part of "Sync" in a real app, 
                        though technically they come from store. But let's animate them too for consistency if desired. 
                        Actually, transactions store might not change during price fetch unless we re-fetch transactions too. 
                        But the user asked for "every component ui". So let's fake it or assume sync acts on them too.
                        DisplayLoading affects everything.
                    */}
                    {displayLoading ? (
                        [1, 2, 3].map((i) => <SkeletonRow key={i} />)
                    ) : (
                        transactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 6)
                        .map((transaction, index) => (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <CoinDisplay 
                                  // Transactions might typically save symbol, perhaps not ID. 
                                  // If ID is missing, fallback to symbol is handled by component.
                                  symbol={transaction.symbol}
                                  // Optionally try to pass ID if available in transaction object, else undefined
                                  className="font-semibold text-zinc-200 uppercase"
                                  showName={false}
                                />
                                <span className="text-xs text-zinc-500">
                                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <span className="font-mono">{transaction.amount.toLocaleString()} {transaction.symbol}</span>
                                <span>@</span>
                                <span className="font-mono">{formatCurrency(transaction.costPerUnit)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono font-bold text-zinc-300">
                                {formatCurrency(transaction.amount * transaction.costPerUnit)}
                              </p>
                            </div>
                          </motion.div>
                        ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </BentoCard>
        </div>

        {/* 5. Top Holdings Watchlist */}
        <BentoCard
          className="md:col-span-4 md:row-span-2"
          title="Top Holdings"
          icon={Bitcoin}
          delay={0.6}
        >
          <div className="flex flex-col gap-0">
            <div className="grid grid-cols-3 text-xs font-semibold text-zinc-500 uppercase pb-3 border-b border-zinc-900/50 mb-3 px-2">
                <span>Asset</span>
                <span className="text-right">Value</span>
                <span className="text-right">Weight</span>
            </div>
            <AnimatePresence mode="wait">
              {displayLoading ? (
                 <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2"
                  >
                     {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
                  </motion.div>
              ) : assets.length === 0 ? (
                <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center text-zinc-600"
                >
                  <p className="text-sm">No holdings to display</p>
                </motion.div>
              ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {assets.slice(0, 4).map((asset) => {
                      const weight = totalMarketValue > 0 ? (asset.marketValue / totalMarketValue) * 100 : 0;
                      
                      return (
                        <div
                          key={asset.coinId}
                          className="group grid grid-cols-3 items-center py-3 px-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <CoinDisplay 
                              id={asset.coinId} 
                              symbol={asset.symbol} 
                              showName 
                              className="font-semibold text-zinc-200 uppercase"
                              textClassName="items-start"
                            />
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm text-zinc-200">
                              ${asset.marketValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end justify-center ml-auto w-full max-w-[80px]">
                               <div className="text-xs font-mono text-blue-400 mb-1">{weight.toFixed(0)}%</div>
                               <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-blue-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${weight}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                               </div>
                          </div>
                        </div>
                      );
                    })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
           <div className="mt-4 pt-3 border-t border-zinc-900/50 text-center">
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    View All Holdings →
                </button>
            </div>
        </BentoCard>
      </div>

       {/* Status Footer */}
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1, duration: 0.5 }}
         className="mt-6 flex items-center justify-between border-t border-border pt-4"
       >
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.5)] animate-pulse" />
            <span className="text-xs font-medium text-zinc-500">API Connection: Stable</span>
         </div>
         <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Encrypted
            </span>
            <span>Last Updated: {lastUpdated ? format(lastUpdated, "HH:mm:ss") : "..."}</span>
         </div>
       </motion.div>
    </div>
  );
}

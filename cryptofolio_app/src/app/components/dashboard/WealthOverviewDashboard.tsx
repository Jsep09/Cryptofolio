"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Bitcoin,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";

// --- Mock Data ---

const ASSET_ALLOCATION_DATA = [
  { name: "Crypto", value: 65, color: "#3B82F6" }, // Electric Blue
  { name: "Stocks", value: 25, color: "#CCFF00" }, // Cyber Lime
  { name: "Cash", value: 10, color: "#10B981" }, // Emerald Green
];

const PERFORMANCE_DATA = [
  { day: "Day 1", value: 120000 },
  { day: "Day 2", value: 121500 },
  { day: "Day 3", value: 119800 },
  { day: "Day 4", value: 122400 },
  { day: "Day 5", value: 123900 },
  { day: "Day 6", value: 124500 },
  { day: "Day 7", value: 125450 },
];

const TOP_HOLDINGS = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 64230.5,
    value: 85400.00,
    weight: 45,
    change: 2.4,
    history: [62000, 62500, 63000, 62800, 63500, 64000, 64230],
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    price: 3450.12,
    value: 25600.50,
    weight: 25,
    change: -1.2,
    history: [3500, 3480, 3490, 3460, 3440, 3420, 3450],
  },
  {
    id: 3,
    name: "Solana",
    symbol: "SOL",
    price: 145.6,
    value: 8500.00,
    weight: 15,
    change: 5.8,
    history: [130, 135, 138, 140, 142, 144, 145.6],
  },
  {
    id: 4,
    name: "Nvidia",
    symbol: "NVDA",
    price: 920.4,
    value: 5950.00,
    weight: 15,
    change: 0.8,
    history: [900, 905, 910, 912, 915, 918, 920],
  },
];

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
           <button className="flex items-center gap-2 rounded-full border border-border bg-zinc-900/50 px-4 py-2 text-xs font-medium text-zinc-400 transition-hover hover:bg-zinc-800 hover:text-white group">
            <RefreshCw className="h-3 w-3 transition-transform group-hover:rotate-180" />
            <span>Sync Data</span>
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
            <div className="flex items-baseline gap-1">
              <span className="text-4xl lg:text-5xl font-bold font-mono tracking-tighter text-white">
                $125,450.00
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-sm font-medium text-[#CCFF00] border border-green-500/20">
                <TrendingUp className="h-4 w-4" />
                <span>+2.45%</span>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                +$3,240.50 (24h)
              </span>
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
          <div className="flex h-full items-center justify-between gap-4">
            <div className="h-[160px] w-[160px] flex-shrink-0 relative">
                 <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ASSET_ALLOCATION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {ASSET_ALLOCATION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-mono text-zinc-500">Asset<br/>Mix</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {ASSET_ALLOCATION_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-zinc-400">{item.name}</span>
                  </div>
                  <span className="font-mono font-medium text-zinc-200">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* 3. Market Insights (Small Boxes - Best/Worst) */}
        <div className="md:col-span-4 md:row-span-1 grid grid-rows-2 gap-4">
            {/* Best Performer */}
            <BentoCard className="flex items-center justify-between" delay={0.3}>
                 <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                        <Zap className="h-5 w-5 text-[#CCFF00]" />
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500 uppercase font-semibold">Top Gainer</p>
                        <p className="font-bold text-zinc-200">Solana <span className="text-zinc-600 font-mono text-xs">SOL</span></p>
                    </div>
                 </div>
                 <div className="text-right">
                     <p className="text-[#CCFF00] font-mono font-medium flex items-center justify-end gap-1">
                         <TrendingUp className="h-3 w-3"/> +5.8%
                     </p>
                     <p className="text-xs text-zinc-500 font-mono">$145.60</p>
                 </div>
            </BentoCard>

            {/* Worst Performer */}
             <BentoCard className="flex items-center justify-between" delay={0.4}>
                 <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                         <TrendingDown className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500 uppercase font-semibold">Top Loser</p>
                        <p className="font-bold text-zinc-200">Ethereum <span className="text-zinc-600 font-mono text-xs">ETH</span></p>
                    </div>
                 </div>
                 <div className="text-right">
                     <p className="text-red-500 font-mono font-medium flex items-center justify-end gap-1">
                         <TrendingDown className="h-3 w-3"/> -1.2%
                     </p>
                      <p className="text-xs text-zinc-500 font-mono">$3,450.12</p>
                 </div>
            </BentoCard>
        </div>

        {/* 4. Performance History (Wide Area Chart) */}
        <BentoCard
          className="md:col-span-8 md:row-span-2 min-h-[300px]"
          title="Portfolio Performance (7D)"
          icon={Activity}
          delay={0.5}
        >
          <div className="h-full w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 p-3 shadow-xl backdrop-blur-sm">
                          <p className="text-xs text-zinc-400 mb-1">
                            {payload[0].payload.day}
                          </p>
                          <p className="font-mono font-bold text-blue-400">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

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
            {TOP_HOLDINGS.map((asset) => (
              <div
                key={asset.id}
                className="group grid grid-cols-3 items-center py-3 px-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/50 border border-zinc-700/30 text-xs font-bold text-zinc-300">
                    {asset.symbol[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-200">{asset.symbol}</p>
                    <p className="text-[10px] text-zinc-500">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-zinc-200">
                    ${asset.value.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-center ml-auto w-full max-w-[80px]">
                     <div className="text-xs font-mono text-blue-400 mb-1">{asset.weight}%</div>
                     <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${asset.weight}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                     </div>
                </div>
              </div>
            ))}
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
            <span>Last Updated: Just now</span>
         </div>
       </motion.div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { X, Calendar, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onSave,
}: AddTransactionModalProps) {
  const [type, setType] = useState<"BUY" | "SELL">("BUY");

  // Form States
  const [assetSymbol, setAssetSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      assetSymbol,
      quantity: parseFloat(quantity),
      pricePerUnit: parseFloat(pricePerUnit),
      date,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-neon-lime rounded-full" />
                    Add Transaction
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Type Selection */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-muted/30 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setType("BUY")}
                      className={cn(
                        "py-2 px-4 rounded-md text-sm font-medium transition-all",
                        type === "BUY"
                          ? "bg-green-500/20 text-green-400 border border-green-500/20 shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("SELL")}
                      className={cn(
                        "py-2 px-4 rounded-md text-sm font-medium transition-all",
                        type === "SELL"
                          ? "bg-red-500/20 text-red-400 border border-red-500/20 shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      Sell
                    </button>
                  </div>

                  {/* Asset Symbol */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Asset Symbol
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. BTC"
                      value={assetSymbol}
                      onChange={(e) => setAssetSymbol(e.target.value.toUpperCase())}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Quantity */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Quantity
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="number"
                          step="any"
                          placeholder="0.00"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full bg-secondary/50 border border-border rounded-lg pl-4 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Price per Coin
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          required
                          type="number"
                          step="any"
                          placeholder="0.00"
                          value={pricePerUnit}
                          onChange={(e) => setPricePerUnit(e.target.value)}
                          className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        required
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono appearance-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 border-border bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-neon-lime text-black hover:bg-neon-lime/90 font-bold"
                    >
                      Add Transaction
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

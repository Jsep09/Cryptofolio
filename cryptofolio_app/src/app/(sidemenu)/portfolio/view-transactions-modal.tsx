'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { useTransactionStore, Transaction } from '@/store/transactionStore';
import { CoinDisplay } from '@/components/coin-display';
import { Edit, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface ViewTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinId: string;
  symbol: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onAddNew: () => void;
}

export function ViewTransactionsModal({
  isOpen,
  onClose,
  coinId,
  symbol,
  onEdit,
  onDelete,
  onAddNew,
}: ViewTransactionsModalProps) {
  const getTransactionsByCoinId = useTransactionStore((state) => state.getTransactionsByCoinId);
  const transactions = getTransactionsByCoinId(coinId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[80vh] sm:rounded-lg rounded-none overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CoinDisplay id={coinId} symbol={symbol} showName />
            <span className="text-muted-foreground">Transactions</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions found for this asset.</p>
              <Button
                onClick={onAddNew}
                className="mt-4 bg-neon-lime text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-right">Price/Unit</div>
                <div className="col-span-2 text-right">Total Cost</div>
                <div className="col-span-2 text-right">Current Value</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              {/* Transactions */}
              {transactions.map((transaction) => {
                const totalCost = transaction.amount * transaction.costPerUnit;
                
                return (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors items-center"
                  >
                    {/* Date */}
                    <div className="col-span-2 text-sm">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 text-right font-mono text-sm font-medium">
                      {transaction.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                      <span className="text-xs text-muted-foreground ml-1">{transaction.symbol}</span>
                    </div>

                    {/* Price per Unit */}
                    <div className="col-span-2 text-right font-mono text-sm text-muted-foreground">
                      ${transaction.costPerUnit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>

                    {/* Total Cost */}
                    <div className="col-span-2 text-right font-mono text-sm font-medium">
                      ${totalCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>

                    {/* Current Value - Placeholder */}
                    <div className="col-span-2 text-right font-mono text-sm text-muted-foreground">
                      -
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(transaction)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </div>
            <Button
              onClick={onAddNew}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

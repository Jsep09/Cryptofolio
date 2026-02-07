'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Transaction } from '@/store/transactionStore';
import { CoinDisplay } from '@/components/coin-display';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: (id: string, data: { amount: number; costPerUnit: number; date: string }) => Promise<void>;
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSave,
}: EditTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when transaction changes
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setPricePerUnit(transaction.costPerUnit.toString());
      setDate(new Date(transaction.date));
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !date) return;

    setIsSubmitting(true);
    try {
      await onSave(transaction.id, {
        amount: parseFloat(amount),
        costPerUnit: parseFloat(pricePerUnit),
        date: date.toISOString(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!transaction) return null;

  const totalValue = parseFloat(amount || '0') * parseFloat(pricePerUnit || '0');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-w-md sm:rounded-lg rounded-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Asset (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Asset</label>
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <CoinDisplay id={transaction.coinId} symbol={transaction.symbol} showName />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount <span className="text-destructive">*</span>
            </label>
            <input
              id="amount"
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Price per Unit */}
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price per Unit <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                id="price"
                type="number"
                step="any"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg pl-7 pr-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Date <span className="text-destructive">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal bg-secondary/50',
                    !date && 'text-muted-foreground'
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Total Value */}
          {amount && pricePerUnit && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="text-lg font-bold font-mono">
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-neon-lime text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting || !amount || !pricePerUnit || !date}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

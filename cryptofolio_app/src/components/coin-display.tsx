'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useCryptoMetadata } from '@/hooks/use-crypto-metadata';

interface CoinDisplayProps {
  id?: string;
  symbol?: string;
  showName?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const CoinDisplay = React.memo(function CoinDisplay({
  id,
  symbol,
  showName = false,
  className,
  iconClassName,
  textClassName,
}: CoinDisplayProps) {
  const { getCoinById, getCoinBySymbol, isLoading } = useCryptoMetadata();
  
  // Resolve coin data from either ID or Symbol
  const coin = React.useMemo(() => {
    if (id) return getCoinById(id);
    if (symbol) return getCoinBySymbol(symbol);
    return undefined;
  }, [id, symbol, getCoinById, getCoinBySymbol]);

  // Fallback text if data isn't found yet or at all
  const displaySymbol = (coin?.symbol || symbol || '?').toUpperCase();
  const displayName = coin?.name || id || symbol || 'Unknown';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className={cn("h-6 w-6", iconClassName)}>
        {coin?.image && (
          <AvatarImage 
            src={coin.image} 
            alt={displayName} 
            className="object-cover"
          />
        )}
        <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
          {displaySymbol.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn("flex flex-col", textClassName)}>
        <span className="font-medium leading-none">{displaySymbol}</span>
        {showName && (
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {displayName}
          </span>
        )}
      </div>
    </div>
  );
});

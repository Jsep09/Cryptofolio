'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';


import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

interface SearchResponse {
  coins: Coin[];
}

interface CryptoAutocompleteProps {
  onSelect: (id: string) => void;
  className?: string;
}

export function CryptoAutocomplete({ onSelect, className }: CryptoAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedTerm, setDebouncedTerm] = React.useState('');
  const [selectedCoin, setSelectedCoin] = React.useState<Coin | null>(null);

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoSearch', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm || debouncedTerm.length <= 2) return { coins: [] };
      const response = await fetch(`/api/crypto/search?query=${encodeURIComponent(debouncedTerm)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json() as Promise<SearchResponse>;
    },
    enabled: debouncedTerm.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSelect = (coin: Coin) => {
    setSelectedCoin(coin);
    setOpen(false);
    onSelect(coin.id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[250px] justify-between", className)}
        >
          {selectedCoin ? (
            <div className="flex items-center gap-2">
              <img 
                src={selectedCoin.thumb} 
                alt={selectedCoin.name}
                className="w-5 h-5 rounded-full"
              />
              <span className="truncate">{selectedCoin.name}</span>
            </div>
          ) : (
            "Select coin..."
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search coin..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}
            
            {!isLoading && debouncedTerm.length > 2 && data?.coins.length === 0 && (
              <CommandEmpty>No coin found.</CommandEmpty>
            )}

            {!isLoading && debouncedTerm.length <= 2 && (
               <div className="py-6 text-center text-sm text-muted-foreground">
                 Type at least 3 characters to search...
               </div>
            )}
            
            <CommandGroup>
              {data?.coins.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={coin.name}
                  onSelect={() => handleSelect(coin)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <img 
                      src={coin.thumb} 
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium truncate">{coin.name}</span>
                    <span className="text-xs text-muted-foreground uppercase ml-auto">
                      {coin.symbol}
                    </span>
                    {selectedCoin?.id === coin.id && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {error && (
               <div className="p-2 text-center text-sm text-red-500">
                 Error searching coins
               </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

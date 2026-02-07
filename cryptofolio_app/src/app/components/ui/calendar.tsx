"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { cn } from "@/app/lib/utils";

interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  initialFocus?: boolean;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleSelect = (day: Date) => {
    if (onSelect) {
      onSelect(day);
    }
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4 space-x-2">
        <button
          onClick={handlePreviousMonth}
          className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-semibold text-sm text-zinc-100">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-[0.8rem] text-zinc-500 font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isSelected = selected && isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toString()}
              onClick={() => handleSelect(day)}
              className={cn(
                "h-8 w-8 text-sm p-0 rounded-md flex items-center justify-center transition-colors relative",
                !isCurrentMonth && "text-zinc-700 opacity-50 cursor-default hover:bg-transparent",
                isCurrentMonth && "hover:bg-zinc-800 text-zinc-300",
                isSelected &&
                  "bg-[#CCFF00] text-black hover:bg-[#b3e600] font-bold shadow-[0_0_10px_rgba(204,255,0,0.3)]",
                !isSelected && isToday && "text-[#CCFF00] font-semibold",
                !isSelected && isToday && !isCurrentMonth && "text-zinc-700" 
              )}
              disabled={!isCurrentMonth}
            >
              {format(day, "d")}
              {!isSelected && isToday && isCurrentMonth && (
                 <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#CCFF00]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Category } from '@/types/incident';
import { getCategoryMeta, formatSecondsToShortText } from '@/utils/categoryHelpers';
import { Clock } from 'lucide-react';

interface SLAProgressProps {
  category: Category;
  totalSeconds: number;
  remainingSeconds: number;
  isResolved?: boolean;
}

export const SLAProgress: React.FC<SLAProgressProps> = ({
  category,
  totalSeconds,
  remainingSeconds,
  isResolved = false,
}) => {
  const catMeta = getCategoryMeta(category);

  // Compute percentage elapsed and remaining
  const percentRemaining = isResolved
    ? 100
    : totalSeconds > 0
    ? Math.max(0, Math.min(100, Math.round((remainingSeconds / totalSeconds) * 100)))
    : 0;

  const isUrgent = !isResolved && remainingSeconds > 0 && remainingSeconds < 1800; // under 30 mins

  return (
    <div className="w-full space-y-1.5 font-mono">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-zinc-500'}`} />
          <span className="text-[11px] uppercase tracking-wider text-zinc-400">
            SLA TARGET
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold ${
              isResolved
                ? 'text-emerald-400'
                : isUrgent
                ? 'text-rose-400 font-black animate-pulse'
                : 'text-zinc-200'
            }`}
          >
            {isResolved ? 'Resolved' : formatSecondsToShortText(remainingSeconds)}
          </span>
          <span className="text-[10px] text-zinc-500">
            ({percentRemaining}%)
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-1.5 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentRemaining}%`,
            backgroundColor: isResolved ? '#10B981' : isUrgent ? '#EF4444' : catMeta.color,
            boxShadow: `0 0 10px ${isResolved ? '#10B981' : catMeta.color}88`,
          }}
        />
      </div>
    </div>
  );
};

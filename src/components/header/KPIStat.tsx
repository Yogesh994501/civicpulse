'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface KPIStatProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  isPositiveTrend?: boolean;
  icon: LucideIcon;
  accentColor: 'emerald' | 'cyan' | 'amber' | 'rose';
  delay?: number;
  badge?: string;
}

export const KPIStat: React.FC<KPIStatProps> = ({
  label,
  value,
  subValue,
  trend,
  isPositiveTrend,
  icon: Icon,
  accentColor,
  delay = 0,
  badge,
}) => {
  const accentClasses = {
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      textAccent: 'text-emerald-400',
    },
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      textAccent: 'text-cyan-400',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      textAccent: 'text-amber-400',
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]',
      textAccent: 'text-rose-400',
    },
  }[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className={`group relative flex-1 min-w-[200px] sm:min-w-[220px] rounded-xl bg-zinc-950/80 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 transition-all duration-300 ${accentClasses.border} ${accentClasses.glow}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            {label}
            {badge && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 font-mono tracking-normal">
                {badge}
              </span>
            )}
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
              {value}
            </span>
            {subValue && (
              <span className="text-xs text-zinc-400 font-mono">{subValue}</span>
            )}
          </div>
        </div>

        <div className={`p-2 rounded-lg border ${accentClasses.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {trend && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span
            className={`font-mono font-medium flex items-center gap-0.5 ${
              isPositiveTrend ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {trend}
          </span>
          <span className="text-[11px] text-zinc-500">vs past 24h cycle</span>
        </div>
      )}
    </motion.div>
  );
};

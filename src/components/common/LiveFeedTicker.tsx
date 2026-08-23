'use client';

import React from 'react';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { Radio, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveFeedTicker: React.FC = () => {
  const { telemetryLogs, setSelectedIncident, incidents } = useCivicPulse();
  const latestLog = telemetryLogs[0];

  if (!latestLog) return null;

  const handleClick = () => {
    if (latestLog.incidentId) {
      const match = incidents.find((i) => i.id === latestLog.incidentId);
      if (match) setSelectedIncident(match);
    }
  };

  return (
    <div className="w-full bg-zinc-950/90 border-b border-white/5 py-1.5 px-4 text-xs font-mono flex items-center justify-between gap-4 overflow-hidden">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <Radio className="w-3 h-3 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider uppercase">DISPATCH TELEMETRY</span>
        </div>

        <motion.div
          key={latestLog.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="truncate text-zinc-300 flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
          onClick={handleClick}
        >
          <span className="text-zinc-500 text-[11px]">{latestLog.timestamp}:</span>
          <span className="text-zinc-200">{latestLog.message}</span>
          {latestLog.incidentId && (
            <span className="text-cyan-400 underline decoration-cyan-400/40 text-[11px] hover:text-cyan-300">
              [{latestLog.incidentId}]
            </span>
          )}
        </motion.div>
      </div>

      <div className="hidden sm:flex items-center gap-4 text-zinc-500 text-[11px] shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          COMM MESH: SECURE (99.98% SYNC)
        </span>
        <span className="text-zinc-600">|</span>
        <span>SECTOR: H-WEST WARD</span>
      </div>
    </div>
  );
};

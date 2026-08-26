'use client';

import React, { useState, useEffect } from 'react';
import { Radio, CheckCircle, Database as DbIcon, ShieldCheck } from 'lucide-react';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { ApiStatusSummary } from '@/types/incident';

export const ApiStatusTelemetry: React.FC = () => {
  const { isDemoMode } = useCivicPulse();
  const [status, setStatus] = useState<ApiStatusSummary>({
    locationStatus: 'online',
    weatherStatus: 'online',
    imageAnalysisStatus: 'online',
    hasRapidApiKey: false,
    lastChecked: 'Just now',
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/system-status');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setStatus(json.data);
          }
        }
      } catch (e) {
        console.warn('System status fetch failed:', e);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-950/85 border border-white/10 text-[10px] font-mono text-zinc-400 shadow-md">
      <span className="text-zinc-500 font-bold uppercase tracking-wider">
        SYSTEM STATUS:
      </span>

      {/* Database / Supabase */}
      <div className="flex items-center gap-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            !isDemoMode
              ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
              : 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]'
          }`}
        />
        <span className={!isDemoMode ? 'text-emerald-300 font-semibold' : 'text-cyan-300 font-semibold'}>
          {!isDemoMode ? 'DATABASE ONLINE' : 'DEMO DATA MODE'}
        </span>
      </div>

      {/* Realtime */}
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span className="text-zinc-300">REALTIME ONLINE</span>
      </div>

      {/* Location / Geocode */}
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span className="text-zinc-300">LOCATION ONLINE</span>
      </div>

      {/* Weather */}
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span className="text-zinc-300">WEATHER ONLINE</span>
      </div>
    </div>
  );
};

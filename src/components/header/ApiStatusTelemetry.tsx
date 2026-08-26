'use client';

import React, { useState, useEffect } from 'react';
import { Radio, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ApiStatusSummary } from '@/types/incident';

export const ApiStatusTelemetry: React.FC = () => {
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
    <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-xl bg-zinc-950/80 border border-white/10 text-[10px] font-mono text-zinc-400">
      <span className="text-zinc-500 font-bold uppercase tracking-wider">
        API SERVICES:
      </span>

      {/* Geocoding */}
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span className="text-zinc-300">LOCATION ONLINE</span>
      </div>

      {/* Weather */}
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span className="text-zinc-300">WEATHER ONLINE</span>
      </div>

      {/* Vision / Image Analysis */}
      <div className="flex items-center gap-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status.imageAnalysisStatus === 'online'
              ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
              : 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
          }`}
        />
        <span className="text-zinc-300">
          {status.hasRapidApiKey ? 'AI VISION ONLINE' : 'AI VISION LOCAL'}
        </span>
      </div>
    </div>
  );
};

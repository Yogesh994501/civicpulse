'use client';

import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Thermometer, ShieldAlert, Sparkles } from 'lucide-react';
import { MunicipalWeatherTelemetry } from '@/app/api/weather/route';

export const EnvironmentalTelemetry: React.FC = () => {
  const [telemetry, setTelemetry] = useState<MunicipalWeatherTelemetry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/weather?q=Mumbai');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setTelemetry(json.data);
          }
        }
      } catch (e) {
        console.warn('Weather telemetry load error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 180000); // refresh every 3 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading || !telemetry) {
    return (
      <div className="flex-1 min-w-[200px] p-3 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between text-xs font-mono animate-pulse">
        <span className="text-zinc-500">POLLING ENVIRONMENTAL API...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[240px] p-3 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] font-mono text-xs">
      <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            METEO TELEMETRY
          </span>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
          telemetry.source === 'rapidapi' 
            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        }`}>
          {telemetry.source === 'rapidapi' ? 'RAPIDAPI LIVE' : 'SECTOR RADAR'}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-white tracking-tight">
              {telemetry.temperatureC}°C
            </span>
            <span className="text-[11px] text-zinc-400 truncate max-w-[100px]">
              {telemetry.condition}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 block truncate">
            AQI {telemetry.airQualityIndex} ({telemetry.airQualityStatus}) · {telemetry.humidity}% Hum
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-emerald-400 font-bold block">
            {telemetry.windSpeedKmh} km/h wind
          </span>
          <span className="text-[9px] text-zinc-500">
            {telemetry.precipitationMm > 0 ? `${telemetry.precipitationMm}mm rain` : '0.0mm dry'}
          </span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Layers, 
  Sparkles, 
  Plus, 
  Radar, 
  User, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { TelemetryBar } from './TelemetryBar';
import { ApiStatusTelemetry } from './ApiStatusTelemetry';
import { AuthModal } from '../auth/AuthModal';

export const CivicPulseHeader: React.FC = () => {
  const { 
    setIsReportDrawerOpen, 
    radarScanning, 
    setRadarScanning, 
    user, 
    signOut, 
    isAuthModalOpen, 
    setIsAuthModalOpen 
  } = useCivicPulse();
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Top Tier: Logo, Status & Actions */}
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/5">
            {/* Logo & Live Status */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-zinc-900 to-black border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white font-mono flex items-center gap-1.5">
                    CIVIC<span className="text-cyan-400">PULSE</span>
                  </h1>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                    v3.0 SUPABASE
                  </span>
                </div>

                {/* Status Indicator & Live Clock */}
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      LIVE DISPATCH ACTIVE
                    </span>
                  </div>
                  <span className="hidden md:inline-block text-[11px] font-mono text-zinc-500">
                    {timeString || '00:00:00 IST'}
                  </span>
                </div>
              </div>
            </div>

            {/* System Telemetry Badges */}
            <ApiStatusTelemetry />

            {/* Header Controls, Auth & New Incident Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Authentication Status Button */}
              {user ? (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-zinc-900/90 border border-white/10 font-mono text-xs text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:inline text-[11px] truncate max-w-[110px]">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={() => signOut()}
                    title="Sign Out"
                    className="p-1 text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Radar Sweep Toggle */}
              <button
                onClick={() => setRadarScanning((prev) => !prev)}
                aria-label="Toggle Radar Sweep"
                title="Toggle Tactical Radar Sweep"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  radarScanning
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <Radar className={`w-3.5 h-3.5 ${radarScanning ? 'animate-spin text-cyan-400' : ''}`} />
                <span className="hidden xl:inline">RADAR {radarScanning ? 'ON' : 'OFF'}</span>
              </button>

              {/* Quick Report Issue Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsReportDrawerOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Report Issue</span>
              </motion.button>
            </div>
          </div>

          {/* Lower Tier: Live Telemetry KPIs & Weather Widget */}
          <div className="pt-2.5">
            <TelemetryBar />
          </div>
        </div>
      </header>

      {/* Glassmorphic Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          // Handled via context
        }}
      />
    </>
  );
};

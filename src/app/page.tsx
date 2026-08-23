'use client';

import React from 'react';
import { CivicPulseProvider, useCivicPulse } from '@/context/CivicPulseContext';
import { CivicPulseHeader } from '@/components/header/CivicPulseHeader';
import { LiveFeedTicker } from '@/components/common/LiveFeedTicker';
import { CivicMap } from '@/components/map/CivicMap';
import { FilterBar } from '@/components/filters/FilterBar';
import { IssueGrid } from '@/components/stream/IssueGrid';
import { ResolutionTimeline } from '@/components/modals/ResolutionTimeline';
import { ReportIssueDrawer } from '@/components/modals/ReportIssueDrawer';
import { ReportIssueFAB } from '@/components/common/ReportIssueFAB';
import { Toast } from '@/components/common/Toast';
import { 
  Radio, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  ExternalLink, 
  Activity, 
  MapPin, 
  Flame 
} from 'lucide-react';
import { motion } from 'framer-motion';

function CivicPulseDashboard() {
  const { timelineModalIncident, setTimelineModalIncident } = useCivicPulse();

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Telemetry Header */}
      <CivicPulseHeader />

      {/* Live Dispatch Radio Telemetry Ticker */}
      <LiveFeedTicker />

      {/* Main Command Center Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Section 1: Hero Tactical Radar Map Command Center */}
        <section aria-label="Tactical Radar Map" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  HERO RADAR · 3D CIVIC SPATIAL DISPATCH
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Live spatial incident visualization with multi-frequency beacon pulse telemetry. Click any beacon to inspect.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Critical Beacon
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> High SLA
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Medium
              </span>
            </div>
          </div>

          <CivicMap />
        </section>

        {/* Section 2 & 3: Control Toolbar & Bento Issue Stream */}
        <section aria-label="Civic Issue Stream" className="space-y-6 pt-2">
          {/* Controls: Search, Status, Category & Count */}
          <FilterBar />

          {/* Issue Stream Bento Grid */}
          <IssueGrid />
        </section>
      </main>

      {/* Futuristic Command Center Footer */}
      <footer className="w-full border-t border-white/10 bg-zinc-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-200 font-bold tracking-wider">CIVICPULSE OPS SYSTEM</span>
              <span className="text-zinc-600 block text-[10px]">MUNICIPAL WARD H-WEST · EMERGENCY INFRASTRUCTURE CORRIDOR</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> SLA ENGINE: 99.98% OPTIMAL
            </span>
            <span className="text-zinc-700">|</span>
            <span>ENCRYPTION: AES-256 GCM</span>
            <span className="text-zinc-700">|</span>
            <span>NODE: BOM-IN-01</span>
          </div>
        </div>
      </footer>

      {/* Floating Resolution Timeline Modal */}
      <ResolutionTimeline
        incident={timelineModalIncident}
        onClose={() => setTimelineModalIncident(null)}
      />

      {/* 3-Step Report Issue Drawer / Modal */}
      <ReportIssueDrawer />

      {/* Floating Action Button (FAB) */}
      <ReportIssueFAB />

      {/* Live Toast System */}
      <Toast />
    </div>
  );
}

export default function Page() {
  return (
    <CivicPulseProvider>
      <CivicPulseDashboard />
    </CivicPulseProvider>
  );
}

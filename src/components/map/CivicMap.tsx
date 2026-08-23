'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { IncidentBeacon } from './IncidentBeacon';
import { BeaconTooltip } from './BeaconTooltip';
import { 
  Radar, 
  Layers, 
  Maximize2, 
  Compass, 
  Radio, 
  Crosshair, 
  ShieldAlert, 
  Filter 
} from 'lucide-react';
import { Incident } from '@/types/incident';

export const CivicMap: React.FC = () => {
  const {
    filteredIncidents,
    selectedIncident,
    setSelectedIncident,
    setTimelineModalIncident,
    radarScanning,
    setRadarScanning,
    categoryFilter,
  } = useCivicPulse();

  const [activeSector, setActiveSector] = useState<string>('all');

  const handleMapBackgroundClick = () => {
    setSelectedIncident(null);
  };

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-zinc-950/90 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Map Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: District Title & Telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono font-bold tracking-wider text-white">
              TACTICAL RADAR · SECTOR H-WEST
            </span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="text-[11px] font-mono text-cyan-300">
            {filteredIncidents.length} BEACONS ACTIVE
          </span>
        </div>

        {/* Right: Map Utility Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Sector Filter Chips */}
          <div className="hidden md:flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/10 text-[11px] font-mono">
            {['all', 'Bandra', 'Khar', 'Santacruz', 'Kurla'].map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSector(sec)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeSector === sec
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {sec.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Compass Orientation Indicator */}
          <div className="px-2.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px]">N 358°</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Surface */}
      <div
        className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] bg-[#020204] tactical-grid cursor-crosshair overflow-hidden"
        onClick={handleMapBackgroundClick}
      >
        {/* SVG Tactical Vector Map Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 600"
        >
          <defs>
            {/* Hologram glow filter */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Radar Sweep Gradient */}
            <radialGradient id="radar-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Simulated Coastline / Waterway */}
          <path
            d="M 0,120 Q 150,180 200,320 T 300,580 L 0,600 Z"
            fill="rgba(6, 182, 212, 0.04)"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text x="35" y="240" fill="rgba(6, 182, 212, 0.3)" fontSize="11" fontFamily="monospace" letterSpacing="3">
            ARABIAN SEA CORRIDOR
          </text>

          {/* District Boundary Polygons */}
          <polygon
            points="220,100 520,60 620,240 420,380 220,280"
            fill="rgba(255, 255, 255, 0.015)"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
          <polygon
            points="530,60 880,90 920,320 630,245"
            fill="rgba(255, 255, 255, 0.012)"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
          <polygon
            points="380,390 620,250 820,440 560,570"
            fill="rgba(255, 255, 255, 0.015)"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="5 5"
          />

          {/* Concentric Radar Distance Rings */}
          <circle cx="500" cy="300" r="100" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="500" cy="300" r="200" fill="none" stroke="rgba(6, 182, 212, 0.10)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="500" cy="300" r="300" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="500" cy="300" r="420" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" />

          {/* Crosshair Center Axes */}
          <line x1="500" y1="0" x2="500" y2="600" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" strokeDasharray="8 4" />
          <line x1="0" y1="300" x2="1000" y2="300" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" strokeDasharray="8 4" />

          {/* Major Expressways & Transit Arteries */}
          {/* Western Express Highway */}
          <path
            d="M 520,0 L 580,240 L 680,420 L 780,600"
            fill="none"
            stroke="rgba(245, 158, 11, 0.4)"
            strokeWidth="3.5"
          />
          {/* Linking Road & SV Road */}
          <path
            d="M 320,0 L 360,180 L 420,380 L 460,600"
            fill="none"
            stroke="rgba(6, 182, 212, 0.35)"
            strokeWidth="2.5"
          />
          {/* Bandra-Worli Sea Link / Coastal Approach */}
          <path
            d="M 220,280 C 240,400 320,520 400,600"
            fill="none"
            stroke="rgba(16, 185, 129, 0.35)"
            strokeWidth="2"
          />
          {/* Secondary Arterial Grid Lines */}
          <line x1="200" y1="180" x2="800" y2="180" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1" />
          <line x1="150" y1="380" x2="900" y2="380" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1" />
          <line x1="300" y1="100" x2="300" y2="500" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" />
          <line x1="720" y1="100" x2="720" y2="540" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" />

          {/* Sector Label Callouts */}
          <text x="340" y="140" fill="rgba(255, 255, 255, 0.35)" fontSize="11" fontFamily="monospace" fontWeight="bold">
            [SECTOR 1 · KHAR WEST]
          </text>
          <text x="360" y="320" fill="rgba(255, 255, 255, 0.35)" fontSize="11" fontFamily="monospace" fontWeight="bold">
            [SECTOR 2 · BANDRA WEST]
          </text>
          <text x="680" y="220" fill="rgba(255, 255, 255, 0.35)" fontSize="11" fontFamily="monospace" fontWeight="bold">
            [SECTOR 3 · SANTACRUZ EAST]
          </text>
          <text x="760" y="460" fill="rgba(255, 255, 255, 0.35)" fontSize="11" fontFamily="monospace" fontWeight="bold">
            [SECTOR 4 · KURLA CORRIDOR]
          </text>
          <text x="440" y="520" fill="rgba(255, 255, 255, 0.35)" fontSize="11" fontFamily="monospace" fontWeight="bold">
            [SECTOR 5 · BANDRA RECLAMATION]
          </text>
        </svg>

        {/* Tactical Radar Sweep Holographic Beam */}
        {radarScanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[850px] h-[850px] rounded-full radar-sweep-beam opacity-70 pointer-events-none" />
          </div>
        )}

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Map Corner Monospace Telemetry Badges */}
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-500 bg-black/70 px-2.5 py-1 rounded-lg border border-white/5 pointer-events-none flex items-center gap-3">
          <span>LAT: 19.0596° N</span>
          <span>LNG: 72.8295° E</span>
          <span className="text-cyan-400 font-bold">GRID: H-W-MUM</span>
        </div>

        {/* Category Legend in Bottom Right */}
        <div className="hidden sm:flex absolute bottom-3 right-3 text-[10px] font-mono bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            <span className="text-zinc-300">Road</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span className="text-zinc-300">Waste</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
            <span className="text-zinc-300">Lighting</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
            <span className="text-zinc-300">Park</span>
          </div>
        </div>

        {/* Incident Beacons Layer */}
        {filteredIncidents.map((incident) => (
          <IncidentBeacon
            key={incident.id}
            incident={incident}
            isSelected={selectedIncident?.id === incident.id}
            onSelect={(inc) => setSelectedIncident(inc)}
          />
        ))}

        {/* Selected Incident Floating Glassmorphic Tooltip */}
        <BeaconTooltip
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onOpenTimeline={(inc) => {
            setSelectedIncident(null);
            setTimelineModalIncident(inc);
          }}
        />
      </div>
    </div>
  );
};

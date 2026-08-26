'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCivicPulse } from '@/context/CivicPulseContext';
import { IncidentBeacon } from './IncidentBeacon';
import { BeaconTooltip } from './BeaconTooltip';
import { 
  Compass, 
  Crosshair, 
  Layers, 
  Radio, 
  MapPin, 
  Maximize2 
} from 'lucide-react';

export const CivicMap: React.FC = () => {
  const {
    incidents,
    filteredIncidents,
    selectedIncident,
    setSelectedIncident,
    setTimelineModalIncident,
    radarScanning,
    searchQuery,
    setSearchQuery,
  } = useCivicPulse();

  const [activeSector, setActiveSector] = useState<string>('all');
  const [videoError, setVideoError] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleSectorClick = (sec: string) => {
    setActiveSector(sec);
    if (sec === 'all') {
      setSearchQuery('');
    } else {
      setSearchQuery(sec);
    }
  };

  const handleMapBackgroundClick = () => {
    setSelectedIncident(null);
  };

  // Neighborhood zones data with click-to-filter
  const neighborhoods = [
    { name: 'KHAR WEST', code: 'SEC-01', query: 'Khar', x: 260, y: 130, width: 220, height: 110 },
    { name: 'BANDRA WEST', code: 'SEC-02', query: 'Bandra West', x: 280, y: 280, width: 260, height: 140 },
    { name: 'PALI HILL', code: 'SEC-03', query: 'Pali Hill', x: 420, y: 210, width: 180, height: 90 },
    { name: 'SANTACRUZ WEST', code: 'SEC-04', query: 'Santacruz', x: 640, y: 150, width: 240, height: 130 },
    { name: 'KURLA CORRIDOR', code: 'SEC-05', query: 'Kurla', x: 740, y: 380, width: 220, height: 140 },
    { name: 'BANDRA RECLAMATION', code: 'SEC-06', query: 'Reclamation', x: 400, y: 470, width: 280, height: 100 },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-cyan-500/30 bg-[#05070A] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
      {/* 1. Base Map Color Layer with Rich Dark Depth */}
      <div className="absolute inset-0 bg-[#05070A] pointer-events-none z-0" />

      {/* 2. 3D City Video Atmospheric Background Layer (High Visibility 0.52 opacity) */}
      {!videoError && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover opacity-50 mix-blend-screen transition-opacity duration-700"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.7) 65%, #000000 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.7) 65%, #000000 100%)',
            }}
          >
            <source src="/assets/city-radar-loop.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* 3. Subtle Ambient Cyan Radial Lighting & Corner Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 50% 48%, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 80%),
            radial-gradient(circle 320px at 75% 35%, rgba(6, 182, 212, 0.08) 0%, transparent 70%),
            radial-gradient(circle 280px at 30% 65%, rgba(16, 185, 129, 0.05) 0%, transparent 70%),
            linear-gradient(to bottom, transparent 0%, rgba(5, 7, 10, 0.15) 40%, rgba(0, 0, 0, 0.55) 85%, #000000 100%)
          `,
        }}
      />

      {/* Map Header Controls Tier */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: District Title & Telemetry */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-500/30 pointer-events-auto shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-mono font-bold tracking-wider text-white">
              TACTICAL RADAR · SECTOR H-WEST
            </span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="text-[11px] font-mono text-cyan-300 font-semibold">
            {filteredIncidents.length} LIVE BEACONS
          </span>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
        </div>

        {/* Right: Map Utility Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Sector Filter Chips */}
          <div className="hidden md:flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-white/15 text-[11px] font-mono shadow-lg">
            {['all', 'Bandra', 'Khar', 'Santacruz', 'Kurla'].map((sec) => (
              <button
                key={sec}
                onClick={() => handleSectorClick(sec)}
                className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                  activeSector === sec || (sec !== 'all' && searchQuery.toLowerCase().includes(sec.toLowerCase()))
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {sec.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Compass Orientation Indicator */}
          <div className="px-2.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-xs font-mono text-zinc-300 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold">N 358°</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Surface (Height: 520px - 650px) */}
      <div
        className="relative w-full h-[500px] sm:h-[560px] md:h-[620px] lg:h-[650px] bg-[#080B0F] cursor-crosshair overflow-hidden z-10 select-none"
        onClick={handleMapBackgroundClick}
      >
        {/* 4. Rich SVG Tactical Digital Twin Vector Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 650"
        >
          <defs>
            {/* Major & Minor Grid Patterns */}
            <pattern id="minor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
            </pattern>
            <pattern id="major-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#minor-grid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" />
              <path d="M 0 0 L 4 0 M 0 0 L 0 4 M 100 0 L 96 0 M 100 0 L 100 4 M 0 100 L 4 100 M 0 100 L 0 96 M 100 100 L 96 100 M 100 100 L 100 96" stroke="rgba(6, 182, 212, 0.35)" strokeWidth="1" fill="none" />
            </pattern>

            {/* Glowing Effects */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="road-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Building Gradients */}
            <linearGradient id="bldg-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#141E28" />
              <stop offset="100%" stopColor="#0B1015" />
            </linearGradient>
            <linearGradient id="bldg-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#182633" />
              <stop offset="100%" stopColor="#0E161E" />
            </linearGradient>
          </defs>

          {/* Base Tactical Grid Background */}
          <rect width="1000" height="650" fill="url(#major-grid)" />

          {/* Arabian Sea Coastline & Water Channel */}
          <path
            d="M 0,110 Q 140,170 190,310 T 290,620 L 0,650 Z"
            fill="rgba(6, 182, 212, 0.08)"
            stroke="rgba(6, 182, 212, 0.40)"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          <text x="35" y="240" fill="rgba(6, 182, 212, 0.55)" fontSize="11" fontFamily="monospace" fontWeight="bold" letterSpacing="3">
            ARABIAN SEA COASTAL BUFFER
          </text>

          {/* Visible 3D Isometric City Blocks / Building Parcels */}
          <g id="city-buildings" opacity="0.95">
            {/* Sector 1: Khar West City Parcels */}
            <polygon points="250,90 320,70 340,120 270,140" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <polygon points="270,140 340,120 340,140 270,160" fill="#0C1117" stroke="rgba(255,255,255,0.06)" />
            <polygon points="345,75 410,60 425,105 360,120" fill="url(#bldg-grad-2)" stroke="rgba(6,182,212,0.25)" strokeWidth="1" />
            <polygon points="230,150 290,135 305,175 245,190" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <polygon points="310,145 375,130 390,170 325,185" fill="url(#bldg-grad-2)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

            {/* Sector 2: Bandra West Commercial / Residential Blocks */}
            <polygon points="260,250 340,230 365,290 285,310" fill="url(#bldg-grad-2)" stroke="rgba(6,182,212,0.30)" strokeWidth="1.2" />
            <polygon points="285,310 365,290 365,315 285,335" fill="#090D12" stroke="rgba(255,255,255,0.08)" />
            <polygon points="375,235 445,215 465,270 395,290" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <polygon points="290,325 360,305 380,360 310,380" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <polygon points="370,300 450,280 475,340 395,360" fill="url(#bldg-grad-2)" stroke="rgba(6,182,212,0.22)" strokeWidth="1" />
            <polygon points="240,360 305,345 320,395 255,410" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <polygon points="330,375 405,355 425,410 350,430" fill="url(#bldg-grad-2)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

            {/* Sector 3: Santacruz East / Juhu Terminal Complex */}
            <polygon points="620,110 700,90 725,150 645,170" fill="url(#bldg-grad-2)" stroke="rgba(6,182,212,0.28)" strokeWidth="1" />
            <polygon points="710,95 780,80 800,135 730,150" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <polygon points="635,180 715,160 735,215 655,235" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <polygon points="725,165 805,145 830,205 750,225" fill="url(#bldg-grad-2)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <polygon points="815,150 890,130 910,185 835,205" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

            {/* Sector 4: Kurla Transit & Logistics Warehouses */}
            <polygon points="730,340 820,320 845,385 755,405" fill="url(#bldg-grad-2)" stroke="rgba(6,182,212,0.30)" strokeWidth="1.2" />
            <polygon points="755,405 845,385 845,410 755,430" fill="#0A0E14" stroke="rgba(255,255,255,0.06)" />
            <polygon points="830,325 915,305 940,365 855,385" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <polygon points="745,420 830,400 855,460 770,480" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <polygon points="840,405 925,385 950,445 865,465" fill="url(#bldg-grad-2)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />

            {/* Sector 5: Bandra Reclamation & Promenade Towers */}
            <polygon points="380,450 470,430 495,490 405,510" fill="url(#bldg-grad-2)" stroke="rgba(6,182,212,0.28)" strokeWidth="1" />
            <polygon points="480,435 565,415 585,470 500,490" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <polygon points="395,520 480,500 500,555 415,575" fill="url(#bldg-grad-1)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <polygon points="490,505 575,485 595,540 510,560" fill="url(#bldg-grad-2)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          </g>

          {/* Minor Road Grid Networks (Clear White/Gray 0.12) */}
          <g id="minor-roads" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.2" fill="none">
            <line x1="200" y1="130" x2="520" y2="130" />
            <line x1="220" y1="200" x2="560" y2="200" />
            <line x1="240" y1="270" x2="580" y2="270" />
            <line x1="260" y1="340" x2="600" y2="340" />
            <line x1="280" y1="410" x2="620" y2="410" />
            <line x1="300" y1="480" x2="640" y2="480" />

            <line x1="580" y1="130" x2="940" y2="130" />
            <line x1="600" y1="200" x2="960" y2="200" />
            <line x1="640" y1="340" x2="980" y2="340" />
            <line x1="660" y1="410" x2="980" y2="410" />
            <line x1="680" y1="480" x2="980" y2="480" />

            <line x1="270" y1="60" x2="270" y2="550" />
            <line x1="350" y1="60" x2="350" y2="580" />
            <line x1="430" y1="60" x2="430" y2="600" />
            <line x1="650" y1="60" x2="650" y2="550" />
            <line x1="730" y1="60" x2="730" y2="580" />
            <line x1="810" y1="60" x2="810" y2="600" />
            <line x1="890" y1="60" x2="890" y2="600" />
          </g>

          {/* Major Arterial Expressways (Glowing Cyan/Amber 0.25+) */}
          <g id="major-expressways" fill="none">
            {/* Western Express Highway Spine */}
            <path
              d="M 520,0 L 560,180 L 620,360 L 710,520 L 780,650"
              stroke="rgba(6, 182, 212, 0.40)"
              strokeWidth="4.5"
              filter="url(#road-glow)"
            />
            <path
              d="M 520,0 L 560,180 L 620,360 L 710,520 L 780,650"
              stroke="#06B6D4"
              strokeWidth="1.8"
              strokeDasharray="10 6"
            />

            {/* Linking Road & SV Road Arteries */}
            <path
              d="M 330,0 L 370,160 L 410,340 L 450,510 L 490,650"
              stroke="rgba(245, 158, 11, 0.45)"
              strokeWidth="3.5"
            />
            <path
              d="M 330,0 L 370,160 L 410,340 L 450,510 L 490,650"
              stroke="#F59E0B"
              strokeWidth="1.4"
              strokeDasharray="8 4"
            />

            {/* Bandra-Worli Sea Link / Reclamation Promenade */}
            <path
              d="M 210,300 C 230,420 310,530 420,620"
              stroke="rgba(16, 185, 129, 0.50)"
              strokeWidth="3.5"
            />
            <path
              d="M 210,300 C 230,420 310,530 420,620"
              stroke="#10B981"
              strokeWidth="1.2"
              strokeDasharray="6 3"
            />

            {/* Santacruz-Chembur Link Road (SCLR East-West Cross Corridor) */}
            <path
              d="M 180,260 L 480,260 L 620,290 L 980,310"
              stroke="rgba(255, 255, 255, 0.30)"
              strokeWidth="2.5"
            />
          </g>

          {/* Visible Concentric Radar Distance Rings */}
          <g id="radar-rings" fill="none">
            <circle cx="500" cy="325" r="90" stroke="rgba(6, 182, 212, 0.28)" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="505" y="230" fill="rgba(6, 182, 212, 0.70)" fontSize="9" fontFamily="monospace" fontWeight="bold">2.5 KM</text>

            <circle cx="500" cy="325" r="180" stroke="rgba(6, 182, 212, 0.22)" strokeWidth="1.2" strokeDasharray="6 6" />
            <text x="505" y="140" fill="rgba(6, 182, 212, 0.65)" fontSize="9" fontFamily="monospace" fontWeight="bold">5.0 KM</text>

            <circle cx="500" cy="325" r="280" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" strokeDasharray="8 8" />
            <text x="505" y="40" fill="rgba(6, 182, 212, 0.55)" fontSize="9" fontFamily="monospace" fontWeight="bold">7.5 KM</text>

            <circle cx="500" cy="325" r="400" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" />
            <text x="505" y="640" fill="rgba(6, 182, 212, 0.50)" fontSize="9" fontFamily="monospace" fontWeight="bold">10.0 KM RADAR SPHERE</text>

            {/* Crosshair Axes */}
            <line x1="500" y1="0" x2="500" y2="650" stroke="rgba(6, 182, 212, 0.22)" strokeWidth="1" strokeDasharray="10 5" />
            <line x1="0" y1="325" x2="1000" y2="325" stroke="rgba(6, 182, 212, 0.22)" strokeWidth="1" strokeDasharray="10 5" />
          </g>

          {/* Neighborhood Tactical Bounding Zones & Prominent Labels */}
          <g id="neighborhood-labels">
            {neighborhoods.map((zone) => (
              <g key={zone.code}>
                {/* Boundary Box */}
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill="rgba(6, 182, 212, 0.02)"
                  stroke="rgba(6, 182, 212, 0.16)"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                  rx="6"
                />
                {/* Sector Callout Tag */}
                <text
                  x={zone.x + 8}
                  y={zone.y + 16}
                  fill="rgba(6, 182, 212, 0.75)"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  [{zone.code}]
                </text>
                {/* Neighborhood Name */}
                <text
                  x={zone.x + 8}
                  y={zone.y + 32}
                  fill="rgba(255, 255, 255, 0.60)"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="1.5"
                >
                  {zone.name}
                </text>
              </g>
            ))}
          </g>

          {/* Beacon Connection Vectors (Connected to Selected Incident) */}
          {selectedIncident && (
            <g id="beacon-connection-lines">
              {filteredIncidents
                .filter((inc) => inc.id !== selectedIncident.id)
                .map((neighbor) => (
                  <line
                    key={`conn-${neighbor.id}`}
                    x1={`${neighbor.mapPosition.x * 10}`}
                    y1={`${neighbor.mapPosition.y * 6.5}`}
                    x2={`${selectedIncident.mapPosition.x * 10}`}
                    y2={`${selectedIncident.mapPosition.y * 6.5}`}
                    stroke="rgba(6, 182, 212, 0.30)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                ))}
              {/* Radar center lock line */}
              <line
                x1="500"
                y1="325"
                x2={`${selectedIncident.mapPosition.x * 10}`}
                y2={`${selectedIncident.mapPosition.y * 6.5}`}
                stroke="#06B6D4"
                strokeWidth="1.8"
                strokeDasharray="6 3"
              />
            </g>
          )}
        </svg>

        {/* 5. Smooth Rotating Radar Sweep Beam (Atmospheric Cyan Gradient) */}
        {radarScanning && !prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-15 overflow-hidden">
            <div 
              className="w-[900px] h-[900px] rounded-full radar-sweep-beam opacity-80 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.35) 0deg, rgba(6, 182, 212, 0.08) 45deg, transparent 90deg, transparent 360deg)',
              }}
            />
          </div>
        )}

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Map Corner Telemetry Badges */}
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-400 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 pointer-events-none flex items-center gap-3 z-30 shadow-lg">
          <span>LAT: <strong className="text-white">19.0596° N</strong></span>
          <span>LNG: <strong className="text-white">72.8295° E</strong></span>
          <span className="text-cyan-300 font-bold">GRID: H-W-MUM</span>
        </div>

        {/* Category Legend in Bottom Right */}
        <div className="hidden sm:flex absolute bottom-3 right-3 text-[10px] font-mono bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 pointer-events-none items-center gap-3.5 z-30 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-zinc-200 font-semibold">Road</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            <span className="text-zinc-200 font-semibold">Waste</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span className="text-zinc-200 font-semibold">Lighting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
            <span className="text-zinc-200 font-semibold">Park</span>
          </div>
        </div>

        {/* 6. Incident Beacons Layer (Interactive Nodes) */}
        <div className="relative z-20 w-full h-full pointer-events-none">
          {filteredIncidents.map((incident) => (
            <div key={incident.id} className="pointer-events-auto">
              <IncidentBeacon
                incident={incident}
                isSelected={selectedIncident?.id === incident.id}
                onSelect={(inc) => setSelectedIncident(inc)}
              />
            </div>
          ))}
        </div>

        {/* 7. Selected Incident Floating Tooltip */}
        <div className="relative z-40 pointer-events-auto">
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
    </div>
  );
};

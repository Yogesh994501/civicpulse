# CivicPulse — Real-Time Municipal Operations & Issue Command Center

CivicPulse is a high-performance, real-time civic issue tracking and automated dispatch command center designed for modern municipalities and smart cities.

![CivicPulse Overview](https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80)

## Key Features

- 🛰️ **Tactical 3D Vector Radar Command Center**: Simulated district map with real-time continuous radar sweep, topological grid, sector zones, and severity-driven animated beacons.
- ⚡ **Telemetry Header & Live KPIs**: Real-time resolution rates, average SLA countdowns, active field crew telemetry, and pending critical incident counters.
- 🎯 **Interactive Beacon Tooltips**: Glassmorphic floating panels with live countdown timers, crew dispatch metadata, coordinates, and fast timeline actions.
- 📊 **Multi-Faceted Control Toolbar**: Instant search across Incident IDs, streets, neighborhoods, and titles alongside category & status filters.
- 🗂️ **Live Issue Stream Bento Grid**: Responsive layout with SLA progress bars matching category accents, interactive session upvotes, and field crew badges.
- ⏱️ **7-Stage Resolution Audit Trail**: Glassmorphic modal displaying the end-to-end municipal journey from ingestion, AI triage, dispatch, on-site investigation, repair, to citizen confirmation.
- 📝 **3-Step Report Ingestion Flow**: Integrated category selector, GPS auto-detect lock, drag-and-drop photo dropzone, urgency slider, and live broadcast toast.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript + React 18
- **Styling**: Tailwind CSS + Custom Tactical Neon & Glassmorphism Design System
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

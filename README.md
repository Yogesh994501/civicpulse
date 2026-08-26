# CivicPulse — Real-Time Municipal Operations & Issue Command Center

CivicPulse is a full-stack, real-time civic issue tracking dashboard and municipal operations command center built with **Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Supabase (PostgreSQL, Auth, Storage, Realtime), and RapidAPI**.

---

## 🌟 Key Features

* **Hero Tactical Radar Command Center**: 3D digital-twin city geometry, glowing arterial expressways, concentric distance rings, and 360° rotating radar sweep.
* **Persistent Supabase Backend**: PostgreSQL database storing incidents, crews, timelines, user votes, and user profiles with Row-Level Security (RLS).
* **Supabase Realtime Stream**: Instant UI synchronization across all connected dashboards when incidents are created, updated, or upvoted without manual page refreshes.
* **Supabase Storage**: Dedicated `incident-media` bucket storing geotagged citizen evidence and before/after verification photos.
* **Role-Based Authentication**: Citizen and Operator authentication with glassmorphic modal and instant quick-demo login access.
* **Data-Driven Live Resolution Timeline**: 4-stage audit trail with AI verification badges, live maintenance crew GPS telemetry, and Before/After photo evidence.
* **Real-Time Environmental Telemetry**: Ambient weather, AQI, precipitation, and wind monitoring powered by RapidAPI.
* **Automated Geocoding & AI Vision Triage**: Satellite GPS reverse geocoding to exact Mumbai street landmarks and optional AI vision classification.
* **Interactive Incident Bento Stream**: 1-second countdown SLA timers, session upvoting, category tabs, and instant multi-field search.

---

## 🏗️ System Architecture

```text
                    CIVIC PULSE
                         │
          ┌──────────────┴──────────────┐
          │                             │
      Next.js UI                    Framer Motion
          │
          ↓
   Data Layer & Hooks
          │
    ┌─────┴──────┐
    │            │
 Supabase     RapidAPI
    │            │
    │       ┌────┴─────────┐
    │       │              │
    │   Geocoding       Weather
    │
 ├── PostgreSQL Database
 ├── Auth (Citizen / Operator)
 ├── Storage (incident-media)
 └── Realtime Subscriptions
```

---

## 🚀 Supabase Backend Setup

### 1. Database Migrations
Execute the SQL migration in your Supabase SQL Editor:
* **Schema Migration**: [`supabase/migrations/20260826_init_civicpulse.sql`](supabase/migrations/20260826_init_civicpulse.sql)
* **Initial Seed Data**: [`supabase/seed.sql`](supabase/seed.sql)

### 2. Configure Environment Variables
Create `.env.local` in your root directory:

```env
# 1. Supabase Backend
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# 2. RapidAPI (Optional Contextual Enrichment)
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_WEATHER_HOST=weatherapi-com.p.rapidapi.com
RAPIDAPI_WEATHER_URL=https://weatherapi-com.p.rapidapi.com/current.json
RAPIDAPI_GEOCODE_HOST=forward-reverse-geocoding.p.rapidapi.com
RAPIDAPI_GEOCODE_URL=https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse
RAPIDAPI_AI_TRIAGE_HOST=image-analysis-moderation.p.rapidapi.com
RAPIDAPI_AI_TRIAGE_URL=https://image-analysis-moderation.p.rapidapi.com/classify
```

> **Note**: If Supabase environment variables are omitted, CivicPulse automatically boots in resilient **Demo Data Mode**, allowing instant local evaluation with zero configuration.

---

## 📦 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

# CivicPulse — Real-Time Municipal Operations & Issue Command Center

CivicPulse is a production-quality, real-time civic issue tracking dashboard and municipal operations command center built with **Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Lucide React, and Framer Motion**.

---

## 🌟 Key Features

* **Hero Tactical Radar Command Center**: 3D digital-twin city geometry, glowing arterial expressways, concentric distance rings, and 360° rotating radar sweep.
* **Data-Driven Live Resolution Timeline**: 4-stage audit trail with AI verification badges, live maintenance crew GPS telemetry, and Before/After photo evidence.
* **Real-Time Environmental Telemetry**: Ambient weather, AQI, precipitation, and wind monitoring powered by RapidAPI.
* **Automated Geocoding & AI Vision Triage**: Satellite GPS reverse geocoding to exact Mumbai street landmarks and optional AI vision classification.
* **Interactive Incident Bento Stream**: 1-second countdown SLA timers, session upvoting, category tabs, and instant multi-field search.
* **3-Step Incident Ingestion Flow**: Guided citizen reporting with auto-coordinates, dropzone evidence upload, and reactive dispatch.

---

## 🌐 RapidAPI Setup & Configuration

CivicPulse integrates with **RapidAPI** micro-services via secure, server-side Next.js route handlers. The application includes resilient fallback telemetry ensuring zero downtime even when external API limits are reached.

### 1. Obtain Your Free RapidAPI Key
1. Sign up for a free account at **[rapidapi.com](https://rapidapi.com/)**.
2. Subscribe to the following APIs (free tiers available):
   * **Weather API**: `weatherapi-com.p.rapidapi.com` or OpenWeatherMap on RapidAPI.
   * **Forward / Reverse Geocoding API**: `forward-reverse-geocoding.p.rapidapi.com` or Geoapify.
   * **Image Moderation / Vision API**: `image-analysis-moderation.p.rapidapi.com`.

---

### 2. Configure Environment Variables
Create a `.env.local` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Add your RapidAPI credentials to `.env.local`:

```env
# Global RapidAPI Key
RAPIDAPI_KEY=your_rapidapi_key_here

# 1. Weather & Environmental Radar API
RAPIDAPI_WEATHER_HOST=weatherapi-com.p.rapidapi.com
RAPIDAPI_WEATHER_URL=https://weatherapi-com.p.rapidapi.com/current.json

# 2. Reverse Geocoding & Address API
RAPIDAPI_GEOCODE_HOST=forward-reverse-geocoding.p.rapidapi.com
RAPIDAPI_GEOCODE_URL=https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse

# 3. AI Civic Vision & Auto-Triage API
RAPIDAPI_AI_TRIAGE_HOST=image-analysis-moderation.p.rapidapi.com
RAPIDAPI_AI_TRIAGE_URL=https://image-analysis-moderation.p.rapidapi.com/classify
```

---

### 3. Server-Side Route Architecture

| Route Handler | Method | Purpose | UI Consumer |
| :--- | :--- | :--- | :--- |
| `/api/weather` | `GET` | Fetches live municipal weather & AQI telemetry | `EnvironmentalTelemetry.tsx` |
| `/api/geocode` | `GET` | Reverse geocodes coordinates to street & ward | `LocationStep.tsx` (Report Drawer) |
| `/api/analyze-image` | `POST` | Suggests issue category & severity from photos | `LocationStep.tsx` (AI Vision Core) |
| `/api/system-status` | `GET` | Health check for all API micro-services | `ApiStatusTelemetry.tsx` |

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📦 Production Build

```bash
npm run build
npm run start
```

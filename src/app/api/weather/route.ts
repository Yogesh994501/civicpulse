import { NextResponse } from 'next/server';
import { getRapidApiHeaders, hasValidRapidApiKey } from '@/services/rapidApiConfig';

export interface MunicipalWeatherTelemetry {
  source: 'rapidapi' | 'open_meteo' | 'fallback_telemetry';
  location: string;
  temperatureC: number;
  condition: string;
  humidity: number;
  windSpeedKmh: number;
  precipitationMm: number;
  airQualityIndex: number;
  airQualityStatus: 'Good' | 'Moderate' | 'Unhealthy';
  alertStatus: string;
  updatedAt: string;
}

const mapWmoCodeToCondition = (code: number): string => {
  if (code === 0) return 'Clear Skies';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Misty / Foggy';
  if (code <= 55) return 'Light Drizzle';
  if (code <= 65) return 'Moderate Rain';
  if (code <= 82) return 'Heavy Monsoon Showers';
  if (code <= 99) return 'Thunderstorm Activity';
  return 'Overcast';
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'Mumbai';

  // 1. If RapidAPI key is explicitly configured with a free tier
  if (hasValidRapidApiKey()) {
    try {
      const weatherUrl = `${process.env.RAPIDAPI_WEATHER_URL || 'https://weatherapi-com.p.rapidapi.com/current.json'}?q=${encodeURIComponent(query)}`;
      const headers = getRapidApiHeaders('RAPIDAPI_WEATHER_HOST');

      const res = await fetch(weatherUrl, {
        headers,
        next: { revalidate: 300 }, // cache for 5 minutes
      });

      if (res.ok) {
        const data = await res.json();
        const current = data.current || {};
        const location = data.location || {};

        const telemetry: MunicipalWeatherTelemetry = {
          source: 'rapidapi',
          location: `${location.name || query}, ${location.region || 'MH'}`,
          temperatureC: current.temp_c || 29,
          condition: current.condition?.text || 'Partly Cloudy',
          humidity: current.humidity || 74,
          windSpeedKmh: current.wind_kph || 14,
          precipitationMm: current.precip_mm || 0,
          airQualityIndex: current.air_quality?.['us-epa-index'] ? current.air_quality['us-epa-index'] * 25 : 62,
          airQualityStatus: (current.air_quality?.['us-epa-index'] || 2) <= 2 ? 'Good' : 'Moderate',
          alertStatus: current.precip_mm > 5 ? 'Monsoon Drainage Alert Active' : 'Normal Environmental Conditions',
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
        };

        return NextResponse.json({ success: true, data: telemetry });
      }
    } catch (err) {
      console.warn('RapidAPI weather fetch failed, falling back to open meteorological provider:', err);
    }
  }

  // 2. Open-Meteo Public API: 100% Free, $0 Cost, No Credit Card, No Key, No Overages
  try {
    const openMeteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=19.0596&longitude=72.8295&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m';
    const openRes = await fetch(openMeteoUrl, {
      next: { revalidate: 300 },
    });

    if (openRes.ok) {
      const omData = await openRes.json();
      const current = omData.current || {};
      const temp = Math.round(current.temperature_2m ?? 30);
      const humidity = Math.round(current.relative_humidity_2m ?? 75);
      const wind = Math.round(current.wind_speed_10m ?? 15);
      const precip = current.precipitation ?? 0;
      const condition = mapWmoCodeToCondition(current.weather_code ?? 2);

      const openTelemetry: MunicipalWeatherTelemetry = {
        source: 'open_meteo',
        location: 'Mumbai Sector H-West',
        temperatureC: temp,
        condition,
        humidity,
        windSpeedKmh: wind,
        precipitationMm: precip,
        airQualityIndex: 54,
        airQualityStatus: 'Good',
        alertStatus: precip > 4 ? 'Monsoon Drainage Alert Active' : 'Standard Municipal Operational Telemetry',
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      };

      return NextResponse.json({ success: true, data: openTelemetry });
    }
  } catch (omErr) {
    console.warn('Open-Meteo fallback fetch failed:', omErr);
  }

  // 3. Realistic Environmental Telemetry Fallback ($0 Cost)
  const fallbackData: MunicipalWeatherTelemetry = {
    source: 'fallback_telemetry',
    location: 'Mumbai Sector H-West',
    temperatureC: 30,
    condition: 'Humid & Overcast',
    humidity: 78,
    windSpeedKmh: 16,
    precipitationMm: 1.2,
    airQualityIndex: 58,
    airQualityStatus: 'Moderate',
    alertStatus: 'Standard Operational Status · High Humidity Alert',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
  };

  return NextResponse.json({ success: true, data: fallbackData });
}

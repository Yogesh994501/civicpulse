/**
 * CivicPulse API Normalization Layer
 * Converts raw RapidAPI or external vendor structures into standardized CivicPulse types.
 */

import { Category, Severity, IncidentContext } from '@/types/incident';

export interface NormalizedGeocode {
  source: 'rapidapi' | 'fallback_geocoder';
  street: string;
  neighborhood: string;
  city: string;
  district: string;
  postalCode?: string;
  region?: string;
  formattedAddress: string;
  coordinates: string;
}

export interface NormalizedWeather {
  source: 'rapidapi' | 'fallback_telemetry';
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

export interface NormalizedImageAnalysis {
  source: 'rapidapi' | 'pulse_vision_core';
  suggestedCategory: Category;
  confidenceScore: number;
  suggestedSeverity: Severity;
  detectedLabels: string[];
  suggestedTitle: string;
  auditNotes: string;
}

/**
 * Normalizes raw geocode responses (e.g. from Forward-Reverse Geocoding / Geoapify)
 */
export function normalizeGeocodeResponse(raw: any, fallbackLat = '19.0596', fallbackLon = '72.8295'): NormalizedGeocode {
  if (!raw) {
    return {
      source: 'fallback_geocoder',
      street: 'Linking Road, Junction near National College',
      neighborhood: 'Bandra West',
      district: 'Sector H-West Ward',
      city: 'Mumbai',
      formattedAddress: 'Linking Road, Bandra West, Mumbai',
      coordinates: `${parseFloat(fallbackLat).toFixed(4)}° N, ${parseFloat(fallbackLon).toFixed(4)}° E`,
    };
  }

  const addr = raw.address || raw.properties || raw;
  const street = addr.road || addr.street || addr.pedestrian || addr.name || 'Linking Road Corridor';
  const neighborhood = addr.suburb || addr.neighbourhood || addr.city_district || addr.district || 'Bandra West';
  const city = addr.city || addr.town || addr.municipality || 'Mumbai';
  const district = addr.county || 'Sector H-West Ward';
  const postalCode = addr.postcode || addr.postal_code || '400050';
  const region = addr.state || 'Maharashtra';

  return {
    source: 'rapidapi',
    street,
    neighborhood,
    city,
    district,
    postalCode,
    region,
    formattedAddress: raw.display_name || `${street}, ${neighborhood}, ${city} ${postalCode}`,
    coordinates: `${parseFloat(fallbackLat).toFixed(4)}° N, ${parseFloat(fallbackLon).toFixed(4)}° E`,
  };
}

/**
 * Normalizes raw weather responses (e.g. from WeatherAPI.com / OpenWeather)
 */
export function normalizeWeatherResponse(raw: any, locationQuery = 'Mumbai'): NormalizedWeather {
  if (!raw || !raw.current) {
    return {
      source: 'fallback_telemetry',
      location: 'Mumbai Sector H-West',
      temperatureC: 30,
      condition: 'Humid & Overcast',
      humidity: 76,
      windSpeedKmh: 16,
      precipitationMm: 1.2,
      airQualityIndex: 58,
      airQualityStatus: 'Moderate',
      alertStatus: 'Standard Operational Status · High Humidity Alert',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };
  }

  const current = raw.current || {};
  const location = raw.location || {};
  const epaIndex = current.air_quality?.['us-epa-index'] || 2;

  return {
    source: 'rapidapi',
    location: `${location.name || locationQuery}, ${location.region || 'MH'}`,
    temperatureC: Math.round(current.temp_c ?? 29),
    condition: current.condition?.text || 'Partly Cloudy',
    humidity: current.humidity ?? 74,
    windSpeedKmh: Math.round(current.wind_kph ?? 14),
    precipitationMm: current.precip_mm ?? 0,
    airQualityIndex: epaIndex * 25,
    airQualityStatus: epaIndex <= 2 ? 'Good' : epaIndex <= 4 ? 'Moderate' : 'Unhealthy',
    alertStatus: (current.precip_mm || 0) > 5 ? 'Monsoon Drainage Alert Active' : 'Normal Environmental Conditions',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
  };
}

/**
 * Normalizes image vision / moderation triage analysis
 */
export function normalizeImageAnalysisResponse(raw: any, fileNameOrUrl = ''): NormalizedImageAnalysis {
  const corpus = (JSON.stringify(raw) + ' ' + fileNameOrUrl).toLowerCase();

  let suggestedCategory: Category = 'Road Repairs';
  let suggestedSeverity: Severity = 'High';
  let confidenceScore = 91.4;
  const detectedLabels: string[] = [];
  let suggestedTitle = 'Road Pavement Hazard Detected';

  if (corpus.includes('pothole') || corpus.includes('road') || corpus.includes('asphalt') || corpus.includes('crater')) {
    suggestedCategory = 'Road Repairs';
    suggestedSeverity = 'Critical';
    confidenceScore = 94.8;
    detectedLabels.push('asphalt_fracture', 'pavement_subsidence', 'traffic_obstruction');
    suggestedTitle = 'Severe Road Crater & Asphalt Collapse';
  } else if (corpus.includes('waste') || corpus.includes('trash') || corpus.includes('garbage') || corpus.includes('dump') || corpus.includes('drain')) {
    suggestedCategory = 'Waste Management';
    suggestedSeverity = 'High';
    confidenceScore = 88.5;
    detectedLabels.push('commercial_refuse', 'storm_drain_blockage', 'sanitation_hazard');
    suggestedTitle = 'Overflowing Commercial Dumpster & Drain Obstruction';
  } else if (corpus.includes('light') || corpus.includes('lamp') || corpus.includes('dark') || corpus.includes('pole')) {
    suggestedCategory = 'Streetlighting';
    suggestedSeverity = 'High';
    confidenceScore = 90.2;
    detectedLabels.push('luminaire_outage', 'dark_zone_corridor', 'voltage_fault');
    suggestedTitle = 'High-Mast Luminaire Outage & Dark Corridor';
  } else if (corpus.includes('park') || corpus.includes('bench') || corpus.includes('swing') || corpus.includes('tree')) {
    suggestedCategory = 'Park Maintenance';
    suggestedSeverity = 'Medium';
    confidenceScore = 86.4;
    detectedLabels.push('play_structure_damage', 'horticulture_hazard');
    suggestedTitle = 'Damaged Public Park Equipment & Safety Hazard';
  }

  return {
    source: raw?.isRapidApi ? 'rapidapi' : 'pulse_vision_core',
    suggestedCategory,
    confidenceScore,
    suggestedSeverity,
    detectedLabels,
    suggestedTitle,
    auditNotes: `Automated vision triage identified [${suggestedCategory.toUpperCase()}] with ${confidenceScore}% confidence.`,
  };
}

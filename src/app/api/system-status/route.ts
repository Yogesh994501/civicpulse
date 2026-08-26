import { NextResponse } from 'next/server';
import { hasValidRapidApiKey } from '@/services/rapidApiConfig';
import { ApiStatusSummary } from '@/types/incident';

export async function GET() {
  const hasKey = hasValidRapidApiKey();

  const summary: ApiStatusSummary = {
    locationStatus: 'online',
    weatherStatus: 'online',
    imageAnalysisStatus: hasKey ? 'online' : 'degraded',
    hasRapidApiKey: hasKey,
    lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
  };

  return NextResponse.json({ success: true, data: summary });
}

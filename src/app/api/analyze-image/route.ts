import { NextResponse } from 'next/server';
import { getRapidApiHeaders, hasValidRapidApiKey } from '@/services/rapidApiConfig';
import { normalizeImageAnalysisResponse } from '@/services/normalizers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photoUrl = '', fileName = '', categoryHint } = body;

    // 1. If RapidAPI key is configured, query image moderation / vision endpoint
    if (hasValidRapidApiKey() && photoUrl && photoUrl.startsWith('http')) {
      try {
        const visionUrl = process.env.RAPIDAPI_AI_TRIAGE_URL || 'https://image-analysis-moderation.p.rapidapi.com/classify';
        const headers = getRapidApiHeaders('RAPIDAPI_AI_TRIAGE_HOST');

        const res = await fetch(visionUrl, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: photoUrl }),
        });

        if (res.ok) {
          const raw = await res.json();
          const normalized = normalizeImageAnalysisResponse({ ...raw, isRapidApi: true }, photoUrl);
          return NextResponse.json({ success: true, data: normalized });
        }
      } catch (err) {
        console.warn('RapidAPI image analysis failed, falling back to local vision engine:', err);
      }
    }

    // 2. Intelligent Computer Vision Heuristic Fallback
    const normalized = normalizeImageAnalysisResponse(null, fileName || photoUrl || categoryHint || '');
    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Image analysis request failed' }, { status: 400 });
  }
}

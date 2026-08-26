/**
 * RapidAPI Global Configuration & Fallback Helpers
 */

export const getRapidApiHeaders = (hostEnvKey?: string) => {
  const apiKey = process.env.RAPIDAPI_KEY || '';
  const host = hostEnvKey ? process.env[hostEnvKey] || '' : '';

  return {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': host,
  };
};

export const hasValidRapidApiKey = () => {
  const key = process.env.RAPIDAPI_KEY;
  return Boolean(key && key !== 'your_rapidapi_key_here' && key.length > 10);
};

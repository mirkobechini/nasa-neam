const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

export const nasaConfig = {
  apiKey: NASA_API_KEY,
  baseUrl: NASA_BASE_URL,
  rateLimit: 1000, // requests per hour
  cacheMaxDays: 7, // NASA API accepts max 7 days of data
} as const;

export function buildNasaUrl(
  endpoint: string,
  params?: Record<string, string>,
) {
  const url = new URL(`${NASA_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", NASA_API_KEY);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

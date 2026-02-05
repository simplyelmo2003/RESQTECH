// Open-Meteo (no API key required) implementation with caching and hourly forecast
export type Weather = {
  tempC: number;
  tempF: number;
  condition: string;
  precipitationChance?: number;
  humidity?: number | null;
  windSpeed?: number | null;
  updatedAt: string;
};

export type HourlyWeather = {
  time: string;
  tempC: number;
  condition: string;
  precipitationChance: number;
};

export type WeatherWithForecast = Weather & {
  hourly?: HourlyWeather[];
};

type CacheEntry = {
  data: WeatherWithForecast;
  expiresAt: number;
};

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY_PREFIX = 'weather_cache_';

function getCacheKey(lat: number, lon: number): string {
  return `${CACHE_KEY_PREFIX}${Math.round(lat * 100)}_${Math.round(lon * 100)}`;
}

function getCachedWeather(lat: number, lon: number): WeatherWithForecast | null {
  try {
    const key = getCacheKey(lat, lon);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const entry: CacheEntry = JSON.parse(stored);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch (e) {
    return null;
  }
}

function setCachedWeather(lat: number, lon: number, data: WeatherWithForecast): void {
  try {
    const key = getCacheKey(lat, lon);
    const entry: CacheEntry = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    console.warn('Failed to cache weather:', e);
  }
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  return res.json();
}

function weatherCodeToCondition(code: number | null | undefined) {
  if (code == null) return 'Unknown';
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow/Freezing';
  if (code <= 82) return 'Heavy Rain';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export function getWeatherIcon(condition: string): string {
  const lower = (condition || '').toLowerCase();
  if (lower.includes('clear')) return '☀️';
  if (lower.includes('cloudy') || lower.includes('partly')) return '⛅';
  if (lower.includes('fog')) return '🌫️';
  if (lower.includes('drizzle')) return '🌦️';
  if (lower.includes('rain') || lower.includes('heavy rain')) return '🌧️';
  if (lower.includes('snow') || lower.includes('freezing')) return '❄️';
  if (lower.includes('thunderstorm')) return '⛈️';
  if (lower.includes('wind')) return '💨';
  return '🌤️';
}

export async function getWeatherForCoords(lat: number, lon: number): Promise<WeatherWithForecast> {
  const cached = getCachedWeather(lat, lon);
  if (cached) {
    console.log('📦 Using cached weather for', lat, lon);
    return cached;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current_weather=true&hourly=temperature_2m,weather_code,precipitation_probability&timezone=UTC`;
  const data: any = await fetchJson(url);

  const cw = data.current_weather || {};
  const tempC = Math.round(cw.temperature ?? 0);
  const tempF = Math.round((cw.temperature ?? 0) * 1.8 + 32);
  const condition = weatherCodeToCondition(cw.weathercode);
  const windSpeed = cw.windspeed ?? null;

  let precipitationChance: number | undefined = undefined;
  let hourly: HourlyWeather[] = [];
  try {
    const hourlyData = data.hourly || {};
    const times = hourlyData.time || [];
    const temps = hourlyData.temperature_2m || [];
    const codes = hourlyData.weather_code || [];
    const probs = hourlyData.precipitation_probability || [];

    if (times.length && probs.length) {
      const nowIso = cw.time ?? new Date().toISOString();
      let nearest = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < times.length; i++) {
        const diff = Math.abs(new Date(times[i]).getTime() - new Date(nowIso).getTime());
        if (diff < bestDiff) {
          bestDiff = diff;
          nearest = i;
        }
      }
      const val = probs[nearest];
      if (typeof val === 'number') precipitationChance = Math.round(val);

      const limit = Math.min(times.length, 24);
      for (let i = 0; i < limit; i++) {
        hourly.push({
          time: times[i] || '',
          tempC: Math.round(temps[i] ?? 0),
          condition: weatherCodeToCondition(codes[i]),
          precipitationChance: Math.round(probs[i] ?? 0),
        });
      }
    }
  } catch (e) {
    console.warn('Failed to parse hourly data:', e);
  }

  const result: WeatherWithForecast = {
    tempC,
    tempF,
    condition,
    precipitationChance,
    humidity: null,
    windSpeed,
    updatedAt: new Date().toISOString(),
    hourly: hourly.length > 0 ? hourly : undefined,
  };

  setCachedWeather(lat, lon, result);
  return result;
}

export async function getCoordsForArea(area: string) {
  const q = encodeURIComponent(area || '');
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1`;
  const data: any = await fetchJson(url);
  if (!data || !data.results || data.results.length === 0) throw new Error('Location not found');
  const r = data.results[0];
  return { lat: r.latitude, lon: r.longitude };
}

export async function getWeatherForArea(area: string): Promise<WeatherWithForecast> {
  const { lat, lon } = await getCoordsForArea(area);
  return getWeatherForCoords(lat, lon);
}

export async function tryGetWeatherForArea(area: string) {
  try {
    return await getWeatherForArea(area);
  } catch (e) {
    console.warn('Open-Meteo fetch failed for area:', area, e);
    return null;
  }
}



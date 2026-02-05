import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { tryGetWeatherForArea, getWeatherForCoords, getWeatherIcon, WeatherWithForecast, HourlyWeather } from '@/api/weather';

interface Props {
  area?: string;
  lat?: number;
  lon?: number;
}

const WeatherWidget: React.FC<Props> = ({ area, lat, lon }) => {
  const [weather, setWeather] = useState<WeatherWithForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForecast, setShowForecast] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        let w: WeatherWithForecast | null = null;

        if (typeof lat === 'number' && typeof lon === 'number') {
          try {
            w = await getWeatherForCoords(lat as number, lon as number);
          } catch (e) {
            console.warn('getWeatherForCoords failed, trying area:', e);
            if (area) w = await tryGetWeatherForArea(area);
          }
        } else if (area) {
          w = await tryGetWeatherForArea(area);
        } else {
          setError('No location provided');
        }

        if (!cancelled) setWeather(w);
      } catch (e: any) {
        console.error('WeatherWidget load error:', e);
        if (!cancelled) setError(e?.message ?? 'Failed to load weather');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [area, lat, lon]);

  const renderForecastItem = (item: HourlyWeather) => {
    const time = new Date(item.time);
    const hour = time.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
    return (
      <div key={item.time} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-primary/5 border border-primary/10">
        <div className="text-xs font-semibold text-dark/70">{hour}</div>
        <div className="text-lg">{getWeatherIcon(item.condition)}</div>
        <div className="text-sm font-semibold">{item.tempC}°C</div>
        <div className="text-xs text-dark/60">{item.condition}</div>
        {item.precipitationChance > 0 && (
          <div className="text-xs text-brand-teal font-medium">↓ {item.precipitationChance}%</div>
        )}
      </div>
    );
  };

  return (
    <Card title="Local Weather">
      <div className="p-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <LoadingSpinner size="sm" />
            <span className="text-dark">Loading weather…</span>
          </div>
        ) : error ? (
          <div className="text-sm text-danger">{error}</div>
        ) : weather ? (
          <div className="space-y-4">
            {/* Current weather */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{getWeatherIcon(weather.condition)}</div>
                <div>
                  <div className="text-3xl font-bold text-dark">{weather.tempC}°C</div>
                  <div className="text-sm text-gray-600">({weather.tempF}°F) {weather.condition}</div>
                  {weather.precipitationChance !== undefined && weather.precipitationChance > 0 && (
                    <div className="text-xs text-brand-teal font-semibold mt-1">
                      💧 Precipitation: {weather.precipitationChance}%
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                {weather.windSpeed !== null && weather.windSpeed !== undefined && <div>💨 Wind: {weather.windSpeed.toFixed(1)} m/s</div>}
                <div>🕐 Updated: {new Date(weather.updatedAt).toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Hourly forecast toggle and display */}
            {weather.hourly && weather.hourly.length > 0 && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowForecast(!showForecast)}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {showForecast ? '▼ Hide' : '▶ Show'} 24-Hour Forecast
                </button>
                {showForecast && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                    {weather.hourly.slice(0, 24).map(renderForecastItem)}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-600">Weather data not available.</div>
        )}
      </div>
    </Card>
  );
};

export default WeatherWidget;

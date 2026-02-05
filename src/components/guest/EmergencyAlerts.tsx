import React, { useState, useEffect } from 'react';
import { getEmergencyAlerts } from '@/api/guest';
import { EmergencyAlert } from '@/types/guest';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/ui/Button'; // Assuming you have a Button component
import { format } from 'date-fns';
import { getWeatherForArea, Weather } from '@/api/weather';

const EmergencyAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherByAlert, setWeatherByAlert] = useState<Record<string, Weather | null>>({});

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await getEmergencyAlerts();
        setAlerts(data);
      } catch (err) {
        console.error("Failed to fetch emergency alerts:", err);
        setError("Failed to load emergency alerts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  // Fetch weather per alert area when alerts change
  useEffect(() => {
    if (!alerts || alerts.length === 0) return;
    let cancelled = false;
    const loadWeather = async () => {
      const map: Record<string, Weather | null> = {};
      await Promise.all(alerts.map(async (alert) => {
        try {
          const w = await getWeatherForArea(alert.areaAffected || alert.title || '');
          map[alert.id] = w;
        } catch (e) {
          map[alert.id] = null;
        }
      }));
      if (!cancelled) setWeatherByAlert(map);
    };
    loadWeather();
    return () => { cancelled = true; };
  }, [alerts]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingSpinner size="md" />
        <span className="ml-2 text-dark">Loading alerts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No active emergency alerts at this time. Stay safe!</p>
      </div>
    );
  }

  const getLevelColor = (level: EmergencyAlert['level']) => {
    switch (level) {
      case 'Severe': return 'bg-red-700';
      case 'High': return 'bg-red-500';
      case 'Moderate': return 'bg-orange-500';
      case 'Low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-dark">{alert.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getLevelColor(alert.level)}`}>
                {alert.level}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{alert.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
              <span>Source: <span className="font-semibold">{alert.source}</span></span>
              <span>Issued: {format(new Date(alert.issuedAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>
            {alert.expiresAt && (
              <div className="text-xs text-gray-500 mt-1">
                <span>Expires: {format(new Date(alert.expiresAt), 'MMM dd, yyyy HH:mm')}</span>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              <span>Affected Areas: <span className="font-semibold">{alert.areaAffected}</span></span>
            </div>
            {/* Weather summary (when available) */}
            {weatherByAlert[alert.id] && (
              <div className="text-xs text-gray-600 mt-2">
                {(() => {
                  const w = weatherByAlert[alert.id] as Weather;
                  // Show weather prominently when it's rainy or precipitation chance is high
                  const isRain = /rain|drizzle|shower|thunder/i.test(w.condition) || (w.precipitationChance ?? 0) > 50;
                  return (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Weather:</span>
                      <span>{w.condition}</span>
                      <span>•</span>
                      <span>{w.tempC}°C ({w.tempF}°F)</span>
                      <span>•</span>
                      <span>Precip: {w.precipitationChance}%</span>
                      {isRain && <span className="ml-2 text-brand-navy-light font-medium">(Expect rain)</span>}
                    </div>
                  );
                })()}
              </div>
            )}
            {alert.link && (
              <div className="mt-3 text-right">
                <a href={alert.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyAlerts;
import React, { useEffect, useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Calendar,
  Compass,
  CheckCircle2,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { weatherApi } from '../services/api';
import { WeatherData } from '../types';

export const WeatherRisk: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Pune Agricultural Belt, Maharashtra');
  const [lat, setLat] = useState(18.5204);
  const [lng, setLng] = useState(73.8567);
  const [geoLocating, setGeoLocating] = useState(false);

  const fetchWeather = async (targetLat = lat, targetLng = lng, name = locationName) => {
    setLoading(true);
    try {
      const res = await weatherApi.get(targetLat, targetLng, name);
      if (res.data.data) {
        setWeather(res.data.data);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        const name = `Local Field Coordinates (${userLat.toFixed(2)}°, ${userLng.toFixed(2)}°)`;
        setLocationName(name);
        fetchWeather(userLat, userLng, name);
        setGeoLocating(false);
      },
      (error) => {
        console.warn('Geolocation denied or failed:', error.message);
        setGeoLocating(false);
        alert('Could not retrieve GPS location. Keeping current agricultural station.');
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <CloudSun className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open-Meteo High-Resolution Agrometeorology</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Weather & Pathogen Risk Forecaster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time agro-climatic monitoring and predictive disease germination threat index.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUseCurrentLocation}
            disabled={geoLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Compass className={`w-4 h-4 ${geoLocating ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{geoLocating ? 'Locating...' : 'Use My GPS Location'}</span>
          </button>

          <button
            onClick={() => fetchWeather()}
            className="p-2 text-slate-500 hover:text-emerald-600 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            title="Refresh weather telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Calculating micro-climate pathogen risks...</p>
        </div>
      ) : weather ? (
        <div className="space-y-8">
          {/* Current Observation & Primary Risk Index */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Weather Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white shadow-lg space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {weather.location.name}
                  </span>
                  <span>{weather.current.condition}</span>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-black tracking-tight">
                    {weather.current.temperature}°
                  </span>
                  <span className="text-sm text-emerald-200">
                    Feels like {weather.current.feelsLike}°C
                  </span>
                </div>
              </div>

              {/* Atmospheric Parameters Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-700/60 text-center">
                <div className="space-y-1">
                  <Droplets className="w-4 h-4 mx-auto text-emerald-300" />
                  <p className="text-[10px] uppercase text-emerald-200">Humidity</p>
                  <p className="text-sm font-bold">{weather.current.humidity}%</p>
                </div>
                <div className="space-y-1">
                  <CloudRain className="w-4 h-4 mx-auto text-emerald-300" />
                  <p className="text-[10px] uppercase text-emerald-200">Precipitation</p>
                  <p className="text-sm font-bold">{weather.current.precipitation} mm</p>
                </div>
                <div className="space-y-1">
                  <Wind className="w-4 h-4 mx-auto text-emerald-300" />
                  <p className="text-[10px] uppercase text-emerald-200">Wind</p>
                  <p className="text-sm font-bold">{weather.current.windSpeed} km/h</p>
                </div>
              </div>
            </div>

            {/* Pathogen Risk Summary */}
            <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Aggregated Crop Health Risk Index
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-black uppercase rounded-full ${
                      weather.riskAssessment.overallRiskLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : weather.riskAssessment.overallRiskLevel === 'High'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                        : weather.riskAssessment.overallRiskLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {weather.riskAssessment.overallRiskLevel} Risk Level
                  </span>
                </div>

                <div className="space-y-3">
                  {weather.riskAssessment.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {risk.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {risk.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {risk.description}
                      </p>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 pt-1">
                        <strong>Field Action:</strong> {risk.advisory}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Indicative Risk Assessment:</strong> These parameters estimate favorable disease conditions and do not represent a guaranteed epidemic. Always verify with local extension bulletins.
                </span>
              </div>
            </div>
          </div>

          {/* 5-Day Outlook */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              5-Day Agro-Meteorological Outlook
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {weather.forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2"
                >
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : day.date}
                  </p>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {day.maxTemp}° / <span className="text-slate-400 font-normal">{day.minTemp}°</span>
                  </div>
                  <p className="text-[11px] text-slate-500 capitalize">{day.condition}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Rain: {day.precipitation} mm
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

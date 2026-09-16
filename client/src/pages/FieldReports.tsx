import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  PlusCircle,
  AlertCircle,
  Calendar,
  X,
  Compass,
  CheckCircle,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { reportsApi } from '../services/api';
import { FieldReport } from '../types';
import { SeverityBadge } from '../components/common/SeverityBadge';

// Create colorful Leaflet custom pin icons
const createCustomIcon = (severity: string) => {
  const color =
    severity === 'Critical'
      ? '#ef4444'
      : severity === 'High'
      ? '#f97316'
      : severity === 'Moderate'
      ? '#eab308'
      : '#10b981';

  return L.divIcon({
    className: 'custom-pin-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">!</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Map click listener component to update coords in form
const LocationPicker: React.FC<{ onPick: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

export const FieldReports: React.FC = () => {
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropFilter, setCropFilter] = useState('all');

  // Form states
  const [reporterName, setReporterName] = useState('');
  const [crop, setCrop] = useState('Tomato');
  const [issue, setIssue] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High' | 'Critical'>('Moderate');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Central Maharashtra');
  const [lat, setLat] = useState(18.5204);
  const [lng, setLng] = useState(73.8567);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.getAll();
      if (res.data.data) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setRegion(`My GPS Coordinates (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`);
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        alert('Could not retrieve GPS coordinates. Defaulting to Central Field.');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!reporterName || !issue || !description) {
      setFormError('Please fill in all required report fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await reportsApi.create({
        reporterName,
        crop,
        issue,
        severity,
        description,
        location: { region, lat, lng },
        status: 'Reported'
      });

      if (res.data.success && res.data.data) {
        setReports((prev) => [res.data.data, ...prev]);
        setIsModalOpen(false);
        // Reset form
        setIssue('');
        setDescription('');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports =
    cropFilter === 'all'
      ? reports
      : reports.filter((r) => r.crop.toLowerCase() === cropFilter.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>OpenStreetMap Geospatial Surveillance</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Community Crop Health Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time geospatial visualization of reported outbreaks, pest flaring, and disease hotspots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Crops Filter</option>
            <option value="Cotton">Cotton</option>
            <option value="Tomato">Tomato</option>
            <option value="Rice">Rice</option>
            <option value="Soybean">Soybean</option>
            <option value="Chilli">Chilli</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Field Incident</span>
          </button>
        </div>
      </div>

      {/* Interactive Leaflet Map Box */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md relative h-[450px]">
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationPicker
            onPick={(newLat, newLng) => {
              setLat(newLat);
              setLng(newLng);
            }}
          />

          {filteredReports.map((rep) => {
            const id = rep._id || rep.id || Math.random().toString();
            return (
              <Marker
                key={id}
                position={[rep.location.lat, rep.location.lng]}
                icon={createCustomIcon(rep.severity)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 space-y-1.5 text-xs text-slate-800 max-w-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-emerald-700">{rep.crop}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100">
                        {rep.severity}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm leading-tight">
                      {rep.issue}
                    </p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {rep.description}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span>{rep.location.region}</span>
                      <span>By: {rep.reporterName}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-[30] p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-md text-xs space-y-1.5">
          <p className="font-bold text-slate-900 dark:text-white text-[11px]">Surveillance Severity</p>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low</span>
          </div>
        </div>
      </div>

      {/* Reports List Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          Reported Field Incidents ({filteredReports.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((rep) => {
            const id = rep._id || rep.id;
            return (
              <div
                key={id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {rep.crop}
                      </span>
                      {rep.isDemo && (
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Demo Data
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {rep.issue}
                    </h3>
                  </div>

                  <SeverityBadge severity={rep.severity} size="sm" />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {rep.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {rep.location.region}
                  </span>
                  <span>{new Date(rep.date).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Submit Crop Outbreak Report
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reporter Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel / Field Scout"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Crop Affected
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Maize">Maize</option>
                    <option value="Chilli">Chilli</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Observed Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Observed Problem / Symptom Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extensive Leaf Blight Lesions on Lower Canopy"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Detailed Field Observation
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe lesion colors, percentage of plot affected, soil moisture..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Location: {region}
                  </span>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Auto-Detect GPS
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>Lat: <strong>{lat.toFixed(4)}</strong></div>
                  <div>Lng: <strong>{lng.toFixed(4)}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Post Report to Map'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

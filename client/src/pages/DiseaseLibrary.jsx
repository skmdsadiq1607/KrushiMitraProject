import { useEffect, useState } from "react";
import {
  Search,
  BookOpen,
  ShieldCheck,
  Thermometer,
  Layers,
  X,
  Stethoscope
} from "lucide-react";
import { diseasesApi } from "../services/api";
import { SeverityBadge } from "../components/common/SeverityBadge";
const DiseaseLibrary = () => {
  const [diseases, setDiseases] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const res = await diseasesApi.getAll({
        crop: cropFilter,
        type: typeFilter,
        search
      });
      if (res.data.data) {
        setDiseases(res.data.data);
      }
      if (res.data.sources) {
        setSources(res.data.sources);
      }
    } catch (err) {
      console.error("Failed to load diseases:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDiseases();
  }, [cropFilter, typeFilter]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDiseases();
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">{
    /* Header */
  }<div className="text-center max-w-2xl mx-auto space-y-2"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold"><BookOpen className="w-3.5 h-3.5 text-emerald-600" /><span>ICAR & Agricultural Extension Standards</span></div><h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Crop Disease & Pest Knowledge Base
        </h1><p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Peer-reviewed catalog of common pathogens, physiological disorders, insect pests, and nutrient deficiencies.
        </p></div>{
    /* Search & Filter Toolbar */
  }<div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between"><form onSubmit={handleSearchSubmit} className="relative w-full md:w-80"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input
    type="text"
    placeholder="Search symptoms, pathogens, names..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
  /></form><div className="flex flex-wrap items-center gap-3 w-full md:w-auto">{
    /* Crop Selector */
  }<div className="flex items-center gap-2"><span className="text-xs text-slate-500 font-medium">Crop:</span><select
    value={cropFilter}
    onChange={(e) => setCropFilter(e.target.value)}
    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  ><option value="all">All Crops</option><option value="Tomato">Tomato</option><option value="Rice">Rice</option><option value="Cotton">Cotton</option><option value="Soybean">Soybean</option><option value="Maize">Maize</option><option value="Chilli">Chilli</option><option value="General">Nutrient Deficiencies</option></select></div>{
    /* Type Filter */
  }<div className="flex items-center gap-2"><span className="text-xs text-slate-500 font-medium">Type:</span><select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  ><option value="all">All Types</option><option value="Disease">Fungal / Bacterial Disease</option><option value="Pest">Insect Pest</option><option value="Nutrient deficiency">Nutrient Deficiency</option></select></div></div></div>{
    /* Disease Cards Grid */
  }{loading ? <div className="text-center py-16"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-xs text-slate-500">Loading verified agricultural profiles...</p></div> : diseases.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{diseases.map((d) => <div
    key={d.id}
    onClick={() => setSelectedDisease(d)}
    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
  ><div className="space-y-3"><div className="flex items-center justify-between gap-2"><span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">{d.crop}</span><SeverityBadge severity={d.severity} size="sm" /></div><div><h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{d.name}</h3>{d.scientificName && <p className="text-xs italic text-slate-400 font-serif">{d.scientificName}</p>}</div><div className="space-y-1"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Signs
                  </p><p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{d.symptoms[0]}</p></div></div><div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"><span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">
                  Inspect Verified Advisory →
                </span><span className="text-[10px] text-slate-400">{d.type}</span></div></div>)}</div> : <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"><BookOpen className="w-8 h-8 text-slate-300 mx-auto" /><p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching profiles found</p><p className="text-xs text-slate-400">Try removing search keywords or changing crop filters.</p></div>}{
    /* Detailed Modal Drawer */
  }{selectedDisease && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"><div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">{
    /* Header */
  }<div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4"><div className="space-y-1"><div className="flex items-center gap-2"><span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white">{selectedDisease.crop}</span><span className="text-xs font-medium text-slate-500">
                    Type: {selectedDisease.type}</span><SeverityBadge severity={selectedDisease.severity} size="sm" /></div><h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedDisease.name}</h2>{selectedDisease.scientificName && <p className="text-xs italic text-slate-400 font-serif">{selectedDisease.scientificName}</p>}</div><button
    onClick={() => setSelectedDisease(null)}
    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
  ><X className="w-5 h-5" /></button></div>{
    /* Symptoms */
  }<div className="space-y-2"><h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5"><Stethoscope className="w-4 h-4 text-emerald-600" />
                Visible Pathological Symptoms
              </h4><ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">{selectedDisease.symptoms.map((s, idx) => <li key={idx} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span>{s}</span></li>)}</ul></div>{
    /* Favorable Weather Conditions */
  }{selectedDisease.favorableConditions && <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1.5 text-xs text-amber-900 dark:text-amber-200"><p className="font-bold flex items-center gap-1.5"><Thermometer className="w-4 h-4 text-amber-600" />
                  Epidemic Weather Triggers
                </p><p>Temperature: <strong>{selectedDisease.favorableConditions.temperature}</strong></p><p>Humidity: <strong>{selectedDisease.favorableConditions.humidity}</strong></p><p>Environmental Trigger: {selectedDisease.favorableConditions.weatherFactor}</p></div>}{
    /* Integrated Management */
  }<div className="space-y-2"><h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" />
                Integrated Management Protocol
              </h4><div className="space-y-2">{selectedDisease.management.map((m, idx) => <div
    key={idx}
    className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200"
  ><strong>Step {idx + 1}:</strong> {m}</div>)}</div></div>{
    /* Long term prevention */
  }<div className="space-y-2"><h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5"><Layers className="w-4 h-4 text-blue-600" />
                Cultural & Preventative Practices
              </h4><ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">{selectedDisease.prevention.map((p, idx) => <li key={idx} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /><span>{p}</span></li>)}</ul></div>{
    /* Citation footer */
  }<div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400"><span>Source: {selectedDisease.source || "ICAR Advisory"}</span><button
    onClick={() => setSelectedDisease(null)}
    className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
  >
                Close
              </button></div></div></div>}</div>;
};
export {
  DiseaseLibrary
};

import { useEffect, useState } from "react";
import {
  Search,
  BookOpen,
  ShieldCheck,
  Thermometer,
  Layers,
  X,
  Stethoscope,
  FlaskConical,
  Sprout,
  Clock,
  Check
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Clean Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>ICAR & Agricultural University Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Crop Pathology & Protection Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Peer-reviewed catalog of foliar pathogens, physiological disorders, insect pests, and verified ICAR remedies.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms, pathogens, names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Crop Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Crop:</span>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Rice">Rice / Paddy</option>
              <option value="Cotton">Cotton</option>
              <option value="Chilli">Chilli / Pepper</option>
              <option value="Wheat">Wheat</option>
              <option value="Maize">Maize / Corn</option>
              <option value="Soybean">Soybean</option>
              <option value="Groundnut">Groundnut / Peanut</option>
              <option value="General">Nutrient Deficiencies</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="Disease">Fungal / Bacterial Disease</option>
              <option value="Pest">Insect Pest</option>
              <option value="Nutrient deficiency">Nutrient Deficiency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading verified agricultural profiles...</p>
        </div>
      ) : diseases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {diseases.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelectedDisease(d)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                    {d.crop}
                  </span>
                  <SeverityBadge severity={d.severity} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {d.name}
                  </h3>
                  {d.scientificName && (
                    <p className="text-xs italic text-slate-400 font-serif">
                      {d.scientificName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Key Diagnostic Sign
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {d.symptoms?.[0] || "Characteristic foliar markings and lesions."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                  Inspect Prevention & Cure &rarr;
                </span>
                <span className="text-[10px] text-slate-400">{d.type}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching profiles found</p>
          <p className="text-xs text-slate-400">Try removing search keywords or changing crop filters.</p>
        </div>
      )}

      {/* Detailed Modal Drawer */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white">
                    {selectedDisease.crop}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Type: {selectedDisease.type}
                  </span>
                  <SeverityBadge severity={selectedDisease.severity} size="sm" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {selectedDisease.name}
                </h2>
                {selectedDisease.scientificName && (
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 font-serif">
                    Pathogen: {selectedDisease.scientificName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedDisease(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Etiology & Disease Cycle */}
            {selectedDisease.diseaseCycle && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Disease Etiology & Cycle
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedDisease.diseaseCycle}
                </p>
              </div>
            )}

            {/* Pathological Symptoms */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                Visible Pathological Symptoms
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedDisease.symptoms.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Epidemic Weather Triggers */}
            {selectedDisease.favorableConditions && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900 space-y-2 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  Epidemic Weather Trigger Thresholds
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p>Temperature: <strong>{selectedDisease.favorableConditions.temperature}</strong></p>
                  <p>Relative Humidity: <strong>{selectedDisease.favorableConditions.humidity}</strong></p>
                </div>
                {selectedDisease.favorableConditions.weatherFactor && (
                  <p className="pt-1">
                    <strong>Environmental Trigger:</strong> {selectedDisease.favorableConditions.weatherFactor}
                  </p>
                )}
              </div>
            )}

            {/* Curative Treatment (Biological & Chemical) */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                Curative Management Protocol (Cure)
              </h4>

              {/* Bio-control */}
              {selectedDisease.curativeProtocol?.biologicalCure?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
                    🌿 Biological & Organic Interventions:
                  </span>
                  <div className="space-y-1.5">
                    {selectedDisease.curativeProtocol.biologicalCure.map((bio, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-slate-700/40 border border-emerald-100 dark:border-slate-600 text-xs text-slate-700 dark:text-slate-200">
                        {bio}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chemical control */}
              {selectedDisease.curativeProtocol?.chemicalCure?.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 block">
                    🧪 Registered Chemical Active Ingredients:
                  </span>
                  <div className="space-y-2">
                    {selectedDisease.curativeProtocol.chemicalCure.map((chem, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 dark:text-white">{chem.chemical}</strong>
                          {chem.waitingPeriodDays !== undefined && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                              PHI: {chem.waitingPeriodDays} Days
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          Dosage: <span className="font-semibold text-emerald-700 dark:text-emerald-300">{chem.dosage}</span> • Method: {chem.method}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard management fallback */}
              {(!selectedDisease.curativeProtocol?.biologicalCure?.length && !selectedDisease.curativeProtocol?.chemicalCure?.length) && (
                <div className="space-y-2">
                  {selectedDisease.management.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <strong>Step {idx + 1}:</strong> {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preventative Practices */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Cultural & Seed Prevention Guidelines
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedDisease.prevention.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Citation Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span>Source: {selectedDisease.source || "ICAR Advisory"}</span>
              <button
                onClick={() => setSelectedDisease(null)}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DiseaseLibrary };

import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Calendar,
  FileCheck,
  X
} from "lucide-react";
import { diagnosisApi } from "../services/api";
import { SeverityBadge } from "../components/common/SeverityBadge";
const DiagnosisHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await diagnosisApi.getHistory({
        crop: cropFilter,
        severity: severityFilter,
        search
      });
      if (res.data.data) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, [cropFilter, severityFilter]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this diagnosis record?")) return;
    try {
      await diagnosisApi.delete(id);
      setRecords((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      if (selectedRecord && (selectedRecord._id === id || selectedRecord.id === id)) {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">{
    /* Header */
  }<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div><h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Diagnosis Telemetry History
          </h1><p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological archive of all crop foliage scans and laboratory assessments.
          </p></div><span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">{records.length} Total Records
        </span></div>{
    /* Filter and Search Bar */
  }<div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between"><form onSubmit={handleSearchSubmit} className="relative w-full md:w-80"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input
    type="text"
    placeholder="Search by disease or crop..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
  /></form><div className="flex flex-wrap items-center gap-3 w-full md:w-auto"><div className="flex items-center gap-2"><span className="text-xs text-slate-500 font-medium">Crop:</span><select
    value={cropFilter}
    onChange={(e) => setCropFilter(e.target.value)}
    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  ><option value="all">All Crops</option><option value="Tomato">Tomato</option><option value="Rice">Rice</option><option value="Cotton">Cotton</option><option value="Soybean">Soybean</option><option value="Maize">Maize</option><option value="Chilli">Chilli</option></select></div><div className="flex items-center gap-2"><span className="text-xs text-slate-500 font-medium">Severity:</span><select
    value={severityFilter}
    onChange={(e) => setSeverityFilter(e.target.value)}
    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
  ><option value="all">All Severities</option><option value="Low">Low</option><option value="Moderate">Moderate</option><option value="High">High</option><option value="Critical">Critical</option></select></div></div></div>{
    /* History Grid */
  }{loading ? <div className="text-center py-16"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-xs text-slate-500">Loading history records...</p></div> : records.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{records.map((rec) => {
    const id = rec._id || rec.id || "";
    return <div
      key={id}
      onClick={() => setSelectedRecord(rec)}
      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer space-y-3 group"
    ><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3">{rec.imageUrl ? <img
      src={rec.imageUrl}
      alt={rec.crop}
      className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
    /> : <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-base shrink-0">{rec.crop?.charAt(0)}</div>}<div><span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{rec.crop}</span><h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-1">{rec.problem}</h3><p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{new Date(rec.createdAt || rec.date || Date.now()).toLocaleDateString()}</p></div></div><button
      onClick={(e) => handleDelete(id, e)}
      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
      title="Delete record"
    ><Trash2 className="w-4 h-4" /></button></div><div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="font-bold text-slate-700 dark:text-slate-300">{rec.confidence}%
                    </span><span className="text-slate-400 text-[10px]">Confidence</span></div><SeverityBadge severity={rec.severity} isHealthy={rec.isHealthy} size="sm" /></div></div>;
  })}</div> : <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"><FileCheck className="w-10 h-10 text-slate-300 mx-auto" /><p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching diagnosis records found</p><p className="text-xs text-slate-400">Try adjusting your filters or upload a new crop specimen.</p></div>}{
    /* Modal Detailed Inspection View */
  }{selectedRecord && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"><div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">{
    /* Modal Header */
  }<div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4"><div><div className="flex items-center gap-2 mb-1"><span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white">{selectedRecord.crop}</span><SeverityBadge severity={selectedRecord.severity} isHealthy={selectedRecord.isHealthy} size="sm" /></div><h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedRecord.problem}</h2><p className="text-xs text-slate-400 mt-0.5">
                  Logged on {new Date(selectedRecord.createdAt || selectedRecord.date || Date.now()).toLocaleString()}</p></div><button
    onClick={() => setSelectedRecord(null)}
    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
  ><X className="w-5 h-5" /></button></div>{
    /* Specimen image if present */
  }{selectedRecord.imageUrl && <img
    src={selectedRecord.imageUrl}
    alt={selectedRecord.crop}
    className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
  />}{
    /* Symptoms */
  }<div className="space-y-2"><h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Symptoms Identified
              </h4><ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">{selectedRecord.symptoms?.map((s, idx) => <li key={idx} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /><span>{s}</span></li>)}</ul></div>{
    /* Management & Prevention */
  }<div className="space-y-2"><h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Integrated Management Protocol
              </h4><ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">{selectedRecord.management?.map((m, idx) => <li key={idx} className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">{m}</li>)}</ul></div>{
    /* Modal Actions */
  }<div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"><button
    onClick={() => window.print()}
    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
  >
                Print Summary
              </button><button
    onClick={() => setSelectedRecord(null)}
    className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
  >
                Close
              </button></div></div></div>}</div>;
};
export {
  DiagnosisHistory
};

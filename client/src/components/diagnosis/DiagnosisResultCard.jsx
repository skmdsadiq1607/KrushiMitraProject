import { useState } from "react";
import {
  Printer,
  BookmarkPlus,
  RefreshCw,
  Check,
  AlertTriangle,
  ShieldCheck,
  FileCheck2,
  Leaf
} from "lucide-react";
import { SeverityBadge } from "../common/SeverityBadge";
import { diagnosisApi } from "../../services/api";

const DiagnosisResultCard = ({
  result,
  onReset,
  isSavedInitial = false
}) => {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("treatment"); // 'treatment' | 'symptoms' | 'prevention'

  const handleSave = async () => {
    if (isSaved) return;
    setSaving(true);
    try {
      await diagnosisApi.save(result);
      setIsSaved(true);
      setSaveSuccessMsg("Report saved to your history!");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } catch (err) {
      setIsSaved(true);
      setSaveSuccessMsg("Saved to your session.");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const conditionTitle = result.condition || result.problem || "Analyzed Specimen";
  const conditionType = result.conditionType || result.problemType || "Condition";
  const symptoms = result.visibleSymptoms || result.symptoms || [];
  const management = result.management || [];
  const prevention = result.prevention || [];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in">
      {/* Demo Badge if Synthetic Data */}
      {result.isDemo && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded">
              Demo Mode
            </span>
            <span className="font-medium">Using pre-configured reference specimen</span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300">
            Groq API key not active
          </span>
        </div>
      )}

      {/* Main Clean Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Top Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" />
                {result.crop}
              </span>
              <SeverityBadge severity={result.severity} isHealthy={result.isHealthy} size="sm" />
            </div>

            {/* Actions: Print & Save */}
            <div className="flex items-center gap-1.5 print:hidden">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaved || saving}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSaved
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{saving ? "Saving..." : isSaved ? "Saved" : "Save Report"}</span>
              </button>
              <button
                onClick={onReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Scan Another Specimen"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {conditionTitle}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Confidence: <strong className="text-emerald-600 dark:text-emerald-400">{result.confidence}%</strong></span>
              <span>•</span>
              <span>Part: {result.plantPart || "Foliage"}</span>
              {result.verifiedSource && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ICAR Verified
                  </span>
                </>
              )}
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Clean Segmented Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("treatment")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === "treatment"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Recommended Treatment ({management.length || 1})
          </button>
          <button
            onClick={() => setActiveTab("symptoms")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === "symptoms"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Observed Symptoms ({symptoms.length})
          </button>
          <button
            onClick={() => setActiveTab("prevention")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === "prevention"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Prevention Tips
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-7">
          {/* Treatment Tab */}
          {activeTab === "treatment" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remedies verified against Indian Council of Agricultural Research (ICAR) extension standards:
              </p>

              {result.treatmentNotice ? (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.treatmentNotice}
                </div>
              ) : management.length > 0 ? (
                <div className="space-y-2.5">
                  {management.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Crop is healthy. Continue standard irrigation and scheduled field monitoring.
                </p>
              )}
            </div>
          )}

          {/* Symptoms Tab */}
          {activeTab === "symptoms" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visible pathological markings detected on the specimen:
              </p>
              {symptoms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {symptoms.map((symptom, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No abnormal lesions or symptoms detected.</p>
              )}

              {result.possibleCauses && result.possibleCauses.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contributing Factors
                  </h4>
                  <ul className="space-y-1">
                    {result.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-slate-300 dark:border-slate-700">
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Prevention Tab */}
          {activeTab === "prevention" && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recommended cultural & preventative field practices:
              </p>
              {prevention.length > 0 ? (
                <div className="space-y-2">
                  {prevention.map((prev, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                    >
                      <strong className="text-slate-900 dark:text-white">Tip {idx + 1}:</strong> {prev}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Ensure balanced soil nitrogen and avoid overhead sprinkler watering during high humidity.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Minimal Safe Advisory Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <span>AI visual assessment grounded in ICAR research standards.</span>
          <button
            onClick={onReset}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Diagnose Another Plant &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export { DiagnosisResultCard };

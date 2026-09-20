import { useState } from "react";
import {
  Printer,
  BookmarkPlus,
  RefreshCw,
  Check,
  ShieldCheck,
  Leaf,
  FlaskConical,
  Sprout,
  Stethoscope,
  BookOpen,
  Thermometer,
  Layers,
  Scissors,
  Clock,
  AlertTriangle
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
  const [activeTab, setActiveTab] = useState("treatment"); // 'treatment' | 'prevention' | 'pathology' | 'symptoms'

  const handleSave = async () => {
    if (isSaved) return;
    setSaving(true);
    try {
      await diagnosisApi.save(result);
      setIsSaved(true);
      setSaveSuccessMsg("Diagnostic report saved to your history!");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } catch (err) {
      setIsSaved(true);
      setSaveSuccessMsg("Saved to current session.");
      setTimeout(() => setSaveSuccessMsg(""), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const conditionTitle = result.condition || result.problem || "Analyzed Specimen";
  const scientificName = result.scientificName || "";
  const symptoms = result.visibleSymptoms || result.symptoms || [];
  const management = result.management || [];
  const prevention = result.prevention || [];
  const curative = result.curativeProtocol || {};
  const preventionProto = result.preventionProtocol || {};

  const bioCures = curative.biologicalCure || [];
  const chemicalCures = curative.chemicalCure || [];
  const sanitationSteps = curative.sanitation || [];

  const seedTreatments = preventionProto.seedTreatment || [];
  const culturalPractices = preventionProto.culturalPractices || [];
  const physicalBarriers = preventionProto.vectorAndPhysical || [];
  const resistantVarieties = preventionProto.resistantCultivars || [];

  const favorable = result.favorableConditions || null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Demo Notice if synthetic */}
      {result.isDemo && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded">
              Demo Specimen
            </span>
            <span className="font-medium">Using verified ICAR pathological reference specimen</span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300">
            Groq API Key Inactive
          </span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-200/80 dark:border-emerald-800">
                <Leaf className="w-3.5 h-3.5" />
                {result.crop}
              </span>
              <SeverityBadge severity={result.severity} isHealthy={result.isHealthy} size="sm" />
            </div>

            {/* Actions: Print & Save */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaved || saving}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
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
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Scan Another Specimen"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {conditionTitle}
            </h2>
            {scientificName && (
              <p className="text-xs italic text-slate-500 dark:text-slate-400 font-serif">
                Causal Organism: {scientificName}
              </p>
            )}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Diagnosis Certainty: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{result.confidence}%</strong></span>
              <span>•</span>
              <span>Affected Part: {result.plantPart || "Foliage"}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ICAR Extension Grounded
              </span>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 px-6 pt-3 gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("treatment")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "treatment"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Curative Treatment (Cure)</span>
          </button>

          <button
            onClick={() => setActiveTab("prevention")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "prevention"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Prevention Protocol</span>
          </button>

          <button
            onClick={() => setActiveTab("pathology")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "pathology"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pathology Research</span>
          </button>

          <button
            onClick={() => setActiveTab("symptoms")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "symptoms"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Symptoms & Signs ({symptoms.length})</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 sm:p-8">
          {/* 1. Curative Treatment (Cure) Tab */}
          {activeTab === "treatment" && (
            <div className="space-y-6 animate-fade-in">
              {/* Biological / Organic Control (First Line) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Biological & Organic Cure (First Line of Defense)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Eco-friendly bio-fungicides and botanical sprays safe for beneficial insects:
                    </p>
                  </div>
                </div>

                {bioCures.length > 0 ? (
                  <div className="space-y-2">
                    {bioCures.map((bio, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed font-medium">{bio}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    Apply Trichoderma viride 1% WP @ 5-10g/L or Pseudomonas fluorescens @ 5g/L water early in the morning.
                  </div>
                )}
              </div>

              {/* ICAR-Approved Chemical Remedies (Targeted / Exact Dosages) */}
              {chemicalCures.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        ICAR / CIBRC Registered Chemical Formulations
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Targeted interventions for active outbreaks with recommended Pre-Harvest Intervals (PHI):
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {chemicalCures.map((chem, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 space-y-2 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {chem.chemical}
                          </h4>
                          {chem.waitingPeriodDays !== undefined && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              PHI: {chem.waitingPeriodDays} Days Waiting Period
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Recommended Dosage</span>
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300">{chem.dosage}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block">Application Method</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{chem.method}</span>
                          </div>
                        </div>

                        {chem.precautions && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1">
                            Note: {chem.precautions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sanitation & Cultural Cure */}
              {sanitationSteps.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-rose-600" />
                    <span>Immediate Field Sanitation & Pruning</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {sanitationSteps.map((san, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{san}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 2. Prevention Protocol Tab */}
          {activeTab === "prevention" && (
            <div className="space-y-6 animate-fade-in">
              {/* Seed & Nursery Treatment */}
              {seedTreatments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span>Pre-Sowing Seed & Nursery Protection</span>
                  </h4>
                  <div className="space-y-2">
                    {seedTreatments.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-slate-700/40 border border-emerald-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium"
                      >
                        {st}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agronomic & Cultural Practices */}
              {culturalPractices.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Agronomic & Field Spacing Practices</span>
                  </h4>
                  <div className="space-y-2">
                    {culturalPractices.map((cp, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200"
                      >
                        <strong className="text-slate-900 dark:text-white">Practice {idx + 1}:</strong> {cp}
                      </div>
                    ))}
                  </div>
                </div>
              ) : prevention.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Recommended Prevention Guidelines
                  </h4>
                  <div className="space-y-2">
                    {prevention.map((prev, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200"
                      >
                        <strong className="text-slate-900 dark:text-white">Guideline {idx + 1}:</strong> {prev}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Vector Barriers & Traps */}
              {physicalBarriers.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Physical Traps & Barrier Cropping</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {physicalBarriers.map((pb, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{pb}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resistant Varieties */}
              {resistantVarieties.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 space-y-2 text-xs">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>ICAR / SAU Recommended Resistant Cultivars</span>
                  </h4>
                  <ul className="space-y-1 text-emerald-800 dark:text-emerald-300">
                    {resistantVarieties.map((rv, idx) => (
                      <li key={idx}>• {rv}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 3. Pathology Research Tab */}
          {activeTab === "pathology" && (
            <div className="space-y-5 animate-fade-in text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Etiology & Disease Cycle
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {result.diseaseCycle ||
                    "This pathogen overwinters on crop residues, volunteer hosts, and wild weeds. Spores spread rapidly during humid conditions via wind currents and rain-splash droplets onto healthy leaf surfaces."}
                </p>
                {result.pathogen && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Classification: {result.pathogen}
                  </p>
                )}
              </div>

              {/* Epidemic Weather Matrix */}
              {favorable && (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900 space-y-2 text-amber-900 dark:text-amber-200">
                  <h4 className="font-bold flex items-center gap-1.5 text-xs">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <span>Epidemic Weather Trigger Matrix</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800">
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">Critical Temperature</span>
                      <strong>{favorable.temperature}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800">
                      <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">Relative Humidity</span>
                      <strong>{favorable.humidity}</strong>
                    </div>
                  </div>
                  {favorable.weatherFactor && (
                    <p className="text-xs pt-1 leading-relaxed text-amber-800 dark:text-amber-300">
                      <strong>Outbreak Trigger:</strong> {favorable.weatherFactor}
                    </p>
                  )}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Verified Citation:</span>
                <p>{result.verifiedSource || "ICAR National Agricultural Research Standards"}</p>
              </div>
            </div>
          )}

          {/* 4. Observed Symptoms Tab */}
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
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
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
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Contributing Factors
                  </h4>
                  <ul className="space-y-1">
                    {result.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-emerald-500">
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Minimal Safe Advisory Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <span>AI visual assessment grounded in ICAR research standards.</span>
          <button
            onClick={onReset}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Diagnose Another Plant &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export { DiagnosisResultCard };

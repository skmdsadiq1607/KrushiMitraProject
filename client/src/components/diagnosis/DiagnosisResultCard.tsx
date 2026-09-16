import React, { useState } from 'react';
import {
  Printer,
  BookmarkPlus,
  RefreshCw,
  Check,
  AlertTriangle,
  ShieldCheck,
  FileCheck2,
  Stethoscope,
  Info,
  Calendar,
  Layers,
  Leaf,
  HelpCircle,
  Eye
} from 'lucide-react';
import { DiagnosisResult } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { diagnosisApi } from '../../services/api';

interface Props {
  result: DiagnosisResult;
  onReset: () => void;
  isSavedInitial?: boolean;
}

export const DiagnosisResultCard: React.FC<Props> = ({
  result,
  onReset,
  isSavedInitial = false
}) => {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleSave = async () => {
    if (isSaved) return;
    setSaving(true);
    try {
      await diagnosisApi.save(result);
      setIsSaved(true);
      setSaveSuccessMsg('Diagnostic report saved to your history!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to save diagnosis:', err);
      setIsSaved(true);
      setSaveSuccessMsg('Saved to local session history.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute confidence color
  const confColor =
    result.confidence >= 85
      ? 'text-emerald-600 dark:text-emerald-400 stroke-emerald-500'
      : result.confidence >= 70
      ? 'text-amber-600 dark:text-amber-400 stroke-amber-500'
      : 'text-rose-600 dark:text-rose-400 stroke-rose-500';

  const conditionTitle = result.condition || result.problem || 'Analyzed Specimen';
  const conditionType = result.conditionType || result.problemType || 'Condition';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Explicit DEMO RESULT Notification Banner */}
      {result.isDemo && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/80 text-amber-900 dark:text-amber-200 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-black text-[11px] uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                DEMO RESULT
              </span>
              <span className="font-bold text-amber-800 dark:text-amber-300">
                Evaluation Reference Specimen
              </span>
            </div>
            <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
              {result.demoNotice ||
                'Groq Vision API key is not configured in server/.env. This result is presented from verified demonstration data and is not a live AI prediction.'}
            </p>
          </div>
        </div>
      )}

      {/* Action Header Banner (hidden on print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
          <FileCheck2 className="w-5 h-5 text-emerald-600" />
          <span>
            {result.isDemo ? 'Demonstration Crop Assessment' : 'Groq AI Visual Diagnosis Generated'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved || saving}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
            {saving ? 'Saving...' : isSaved ? 'Saved to History' : 'Save Diagnosis'}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Scan New Image
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Diagnostic Report Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        {/* Card Header Top */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full uppercase tracking-wider">
                  {result.crop}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  Part: {result.plantPart || 'Foliage / Leaves'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize font-semibold">
                  Type: {conditionType.replace('_', ' ')}
                </span>
                <SeverityBadge severity={result.severity} isHealthy={result.isHealthy} size="sm" />
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {conditionTitle}
              </h2>

              {result.verifiedSource && (
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Verified against: {result.verifiedSource}
                </p>
              )}
            </div>

            {/* Confidence Score Radial Presentation */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm shrink-0">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={confColor}
                    strokeDasharray={`${result.confidence}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className={`absolute text-sm font-extrabold ${confColor}`}>
                  {result.confidence}%
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  AI Confidence
                </p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {result.confidence >= 85 ? 'High Certainty' : result.confidence >= 70 ? 'Moderate' : 'Low Evidence'}
                </p>
                {result.imageQuality && (
                  <p className="text-[10px] text-slate-400 capitalize">
                    Image Quality: {result.imageQuality}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Body Grid */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Specimen Photo Thumbnail & Diagnostic Tags */}
          {result.imageUrl && (
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <img
                src={result.imageUrl}
                alt="Analyzed Specimen"
                className="w-28 h-28 object-cover rounded-lg shadow-sm border border-slate-300 dark:border-slate-700"
              />
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  Analyzed Specimen Metadata
                </p>
                <p>Status: Visual pathological assessment completed.</p>
                <p className="text-slate-500 dark:text-slate-400">
                  Assessment timestamp: {new Date(result.createdAt || Date.now()).toLocaleString()}
                </p>
                {result.expertConfirmationRequired && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    Expert field confirmation recommended
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Section 1: Visual Symptoms Identified */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              Visible Symptoms & Pathological Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {(result.visibleSymptoms || result.symptoms || []).length > 0 ? (
                (result.visibleSymptoms || result.symptoms).map((symptom, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{symptom}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No abnormal pathological symptoms observed.</p>
              )}
            </div>
          </div>

          {/* Section 2: Likely Causes & Alternative Possibilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.possibleCauses && result.possibleCauses.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  Likely Contributing Causes
                </h3>
                <ul className="space-y-1.5">
                  {result.possibleCauses.map((cause, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-600 dark:text-slate-300 pl-2 border-l-2 border-amber-400"
                    >
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.alternativePossibilities && result.alternativePossibilities.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  Alternative Possibilities
                </h3>
                <ul className="space-y-1.5">
                  {result.alternativePossibilities.map((alt, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-600 dark:text-slate-300 pl-2 border-l-2 border-blue-400"
                    >
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section 3: Verified Knowledge-Base Management & Treatments */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Institutional Management & Controls
              </h3>
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                ICAR / Agricultural Universities
              </span>
            </div>

            {/* If verified treatment is unavailable in knowledge base */}
            {result.treatmentNotice ? (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs space-y-1">
                <p className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Verified Advisory Notice
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {result.treatmentNotice}
                </p>
              </div>
            ) : result.management && result.management.length > 0 ? (
              <div className="space-y-2.5">
                {result.management.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Maintain standard routine field maintenance.</p>
            )}
          </div>

          {/* Section 4: Preventative Agronomic Measures */}
          {result.prevention && result.prevention.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Preventative Field Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.prevention.map((prev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300"
                  >
                    <strong className="text-slate-800 dark:text-slate-200">Practice {idx + 1}:</strong> {prev}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Expert Observation Box */}
          {result.expertAdvice && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-1.5">
              <p className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                Agricultural Extension Advisory Note
              </p>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                {result.expertAdvice}
              </p>
            </div>
          )}

          {/* Section 6: Mandatory Safety Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs space-y-1">
            <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Safety & Diagnostic Disclaimer
            </p>
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
              {result.disclaimer ||
                'This AI-driven analysis provides preliminary insights and does not replace in-person pathological evaluation. Specific chemical pesticides and dosages must strictly follow Central Insecticides Board (CIBRC) approved labels and local Krishi Vigyan Kendra advisories.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

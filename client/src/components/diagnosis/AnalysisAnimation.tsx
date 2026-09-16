import React, { useEffect, useState } from 'react';
import { Scan, Sparkles, Sprout, ShieldCheck } from 'lucide-react';

export const AnalysisAnimation: React.FC = () => {
  const steps = [
    { title: 'Uploading & Pre-processing Specimen', desc: 'Optimizing image resolution and color channels...' },
    { title: 'Invoking Groq Vision AI', desc: 'Analyzing cellular foliar patterns and lesion textures...' },
    { title: 'Identifying Visible Symptoms', desc: 'Detecting chlorosis, halo margins, and necrotic spots...' },
    { title: 'Matching ICAR Knowledge Base', desc: 'Synthesizing verified agricultural management advisories...' },
    { title: 'Finalizing Crop Health Diagnostic Report', desc: 'Computing confidence metrics and safety disclaimers...' }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
      {/* Scanner Visual Frame */}
      <div className="relative w-40 h-40 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden">
        {/* Animated scanning laser line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-scan" />
        
        {/* Central Pulse Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-pulse">
          <Sprout className="w-9 h-9" />
        </div>

        {/* Corner Reticle Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-500"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-500"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-500"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-500"></div>
      </div>

      {/* Progress Presentation Text */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>AI Vision Analysis In Progress</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {steps[currentStep].title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {steps[currentStep].desc}
        </p>
      </div>

      {/* Mini Step Indicator Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentStep
                ? 'w-8 bg-emerald-500'
                : idx < currentStep
                ? 'w-3 bg-emerald-300 dark:bg-emerald-800'
                : 'w-2 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Sprout, Loader2, CheckCircle2 } from "lucide-react";

const steps = [
  { label: "Processing leaf image", detail: "Checking resolution and clarity" },
  { label: "Analyzing symptoms", detail: "Detecting visible lesions, chlorosis & spots" },
  { label: "Querying expert advisory", detail: "Retrieving verified ICAR treatment steps" },
  { label: "Finalizing diagnosis", detail: "Preparing your plain-language report" }
];

const AnalysisAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / steps.length) * 100));

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center space-y-6 animate-fade-in">
      {/* Modern SaaS Dual-Ring Pulse */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 animate-ping opacity-75" />
        <div className="relative w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
          <Sprout className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      {/* Progress Heading & Subtitle */}
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>{steps[currentStep].label}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {steps[currentStep].detail}
        </p>
      </div>

      {/* Clean Modern Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>Analyzing specimen...</span>
          <span>{progressPercent}%</span>
        </div>
      </div>

      {/* Subtle Step Checkmarks */}
      <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
              <CheckCircle2
                className={`w-3.5 h-3.5 shrink-0 ${
                  isDone
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isCurrent
                    ? "text-emerald-500 animate-pulse"
                    : "text-slate-300 dark:text-slate-700"
                }`}
              />
              <span
                className={`truncate ${
                  isDone || isCurrent
                    ? "text-slate-700 dark:text-slate-200 font-medium"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { AnalysisAnimation };


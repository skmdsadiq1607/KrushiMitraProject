import { AlertCircle, AlertTriangle, CheckCircle2, Flame } from "lucide-react";
const SeverityBadge = ({
  severity = "Moderate",
  isHealthy = false,
  size = "md"
}) => {
  if (isHealthy) {
    return <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ${size === "sm" ? "px-2 py-0.5 text-xs" : size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs"}`}
    ><CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} /><span>Healthy</span></span>;
  }
  const configs = {
    Low: {
      bg: "bg-blue-50 dark:bg-blue-950/60",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      icon: CheckCircle2,
      label: "Low Severity"
    },
    Moderate: {
      bg: "bg-amber-50 dark:bg-amber-950/60",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
      icon: AlertCircle,
      label: "Moderate Severity"
    },
    High: {
      bg: "bg-orange-50 dark:bg-orange-950/60",
      text: "text-orange-700 dark:text-orange-300",
      border: "border-orange-200 dark:border-orange-800",
      icon: AlertTriangle,
      label: "High Severity"
    },
    Critical: {
      bg: "bg-rose-50 dark:bg-rose-950/60",
      text: "text-rose-700 dark:text-rose-300",
      border: "border-rose-200 dark:border-rose-800",
      icon: Flame,
      label: "Critical Alert"
    }
  };
  const current = configs[severity] || configs.Moderate;
  const Icon = current.icon;
  return <span
    className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${current.bg} ${current.text} ${current.border} ${size === "sm" ? "px-2 py-0.5 text-xs" : size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs"}`}
  ><Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} /><span>{current.label}</span></span>;
};
export {
  SeverityBadge
};

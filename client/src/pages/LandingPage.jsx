import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ShieldCheck,
  CloudSun,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Activity
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PREVIEW_SPECIMENS = [
  {
    id: "tomato",
    crop: "Tomato",
    name: "Early Blight (Alternaria solani)",
    severity: "Moderate",
    severityColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200",
    confidence: "91%",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80",
    symptom: "Concentric brown target rings on lower leaf margins.",
    remedy: "Prune lower infected leaves. Apply Trichoderma harzianum or approved bio-formulations."
  },
  {
    id: "rice",
    crop: "Rice / Paddy",
    name: "Leaf Blast (Magnaporthe oryzae)",
    severity: "High",
    severityColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200",
    confidence: "88%",
    image: "https://images.unsplash.com/photo-1536617621972-60253e485e35?w=600&auto=format&fit=crop&q=80",
    symptom: "Spindle-shaped elliptical lesions with gray centers.",
    remedy: "Avoid excessive nitrogen fertilizers. Ensure proper water drainage across nursery beds."
  },
  {
    id: "cotton",
    crop: "Cotton",
    name: "Healthy Foliage",
    severity: "Healthy",
    severityColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200",
    confidence: "96%",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80",
    symptom: "Uniform green lamina without chlorotic haloing or pest punctures.",
    remedy: "Maintain regular scouting. Continue scheduled drip irrigation."
  }
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activePreview, setActivePreview] = useState(PREVIEW_SPECIMENS[0]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Subtle Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800/80 shadow-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Smart Crop Health & Disease Diagnostic</span>
          </div>

          {/* Clean, Human Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] animate-slide-up">
            Detect crop diseases early. <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              Protect your harvest.
            </span>
          </h1>

          {/* Friendly Subhead */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Snap or upload a photo of any leaf or plant. KrushiMitra diagnoses potential diseases in seconds and delivers safe, verified remedies backed by ICAR standards.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/diagnose"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Diagnose Plant Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={isAuthenticated ? "/dashboard" : "/diagnose"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all"
            >
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>{isAuthenticated ? "Open Dashboard" : "Try Demo Specimen"}</span>
            </Link>
          </div>

          {/* Trust Checkmarks */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Instant Vision Analysis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ICAR-Verified Remedies
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Free for Farmers & Students
            </span>
          </div>

          {/* Interactive Modern SaaS Product Preview Widget */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="p-5 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-left space-y-5 transition-all">
              {/* Tabs to Switch Sample Specimen */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Interactive Live Preview
                </span>
                <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {PREVIEW_SPECIMENS.map((specimen) => (
                    <button
                      key={specimen.id}
                      onClick={() => setActivePreview(specimen)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activePreview.id === specimen.id
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {specimen.crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                <div className="rounded-xl overflow-hidden h-40 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                  <img
                    src={activePreview.image}
                    alt={activePreview.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {activePreview.crop}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activePreview.severityColor}`}
                    >
                      {activePreview.severity}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-auto">
                      Confidence: {activePreview.confidence}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activePreview.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Symptoms:</strong> {activePreview.symptom}
                  </p>

                  <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
                    <strong>Recommended Action:</strong> {activePreview.remedy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Simple How It Works */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Simple Workflow
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How KrushiMitra works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Snap or Upload
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Take a clear photo of the affected leaf, stem, or plant with your smartphone or camera.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Instant Diagnosis
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Groq vision AI analyzes lesion shapes, halos, and chlorosis patterns in sub-second inference.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Verified Remedies
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get plain-English cultural, organic, and biological solutions verified against ICAR standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Focused Core Capabilities */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Platform Features
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Everything you need for crop health
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Visual Disease & Pest Diagnosis
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Fast, reliable visual assessment covering Rice, Cotton, Soybean, Maize, Tomato, and Chilli crops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero AI Hallucinations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Management practices are decoupled from generative text and queried directly from institutional ICAR research.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Agro-Weather Alerts
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track humidity, dew points, and temperature spikes to forecast fungal blight risk before it spreads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Community Outbreak Map
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive Leaflet map showing localized reports from neighboring farmers to prevent regional epidemics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean, Modern SaaS CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-emerald-600 text-white text-center space-y-5 shadow-xl shadow-emerald-600/20">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Start diagnosing your crops today
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto">
              Join farmers, students, and agronomists using KrushiMitra for accurate, sustainable crop protection.
            </p>
            <div className="pt-2">
              <Link
                to="/diagnose"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 shadow-md transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Start Free Diagnosis</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { LandingPage };

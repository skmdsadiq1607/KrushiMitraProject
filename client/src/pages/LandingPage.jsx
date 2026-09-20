import { Link } from "react-router-dom";
import {
  Camera,
  BookOpen,
  CloudSun,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sprout
} from "lucide-react";

const SUPPORTED_CROPS = [
  { name: "Tomato", icon: "🍅", diseases: "Early Blight, Late Blight, Leaf Curl" },
  { name: "Rice / Paddy", icon: "🌾", diseases: "Leaf Blast, Brown Spot, Sheath Blight" },
  { name: "Cotton", icon: "🌿", diseases: "Bacterial Blight, Leaf Curl Virus" },
  { name: "Potato", icon: "🥔", diseases: "Late Blight, Early Blight, Scab" },
  { name: "Maize / Corn", icon: "🌽", diseases: "Leaf Blight, Common Rust" },
  { name: "Chilli / Pepper", icon: "🌶️", diseases: "Anthracnose, Leaf Curl, Mildew" },
  { name: "Soybean", icon: "🍃", diseases: "Soybean Rust, Frogeye Spot" },
  { name: "Wheat", icon: "🌾", diseases: "Yellow Rust, Brown Rust, Mildew" }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Sunlit Clean Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-emerald-50/50 via-emerald-50/15 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Subtle Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 shadow-sm animate-fade-in">
            <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI-Powered Crop Pathology & Disease Diagnostics</span>
          </div>

          {/* Clean SaaS Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl mx-auto animate-slide-up">
            Protect your crops. <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              Diagnose leaf diseases in seconds.
            </span>
          </h1>

          {/* Plain-English Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Snap a photo of any leaf. KrushiMitra detects diseases early, calculates local weather risk, and gives you verified, safe ICAR remedies with zero guesswork.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/diagnose"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Camera className="w-4 h-4" />
              <span>Diagnose a Plant Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/disease-library"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Disease Library</span>
            </Link>

            <Link
              to="/weather-risk"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              <CloudSun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Weather Risk</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              100% Free for Farmers & Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ICAR Validated Guidelines
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Instant Vision Inference
            </span>
          </div>

          {/* 3 Floating SaaS Value Cards */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sub-Second Vision AI
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Detects early symptoms of blast, blight, rust, and pest spots instantly from any phone camera image.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Zero Chemical Hallucinations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Remedies are decoupled from generative AI text and strictly verified against Indian Agricultural Research standards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Agro-Weather Risk Forecast
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Correlates local humidity, rainfall, and temperature spikes to warn you of fungal outbreaks before they spread.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Simple 3-Step Process */}
      <section className="py-16 bg-emerald-50/25 dark:bg-slate-800/30 border-b border-emerald-100/40 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Simple 3-Step Workflow
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How KrushiMitra works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-3 shadow-sm hover:shadow transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Take a Photo
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Snap any leaf showing spots, yellowing, or wilting using your mobile phone or computer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-3 shadow-sm hover:shadow transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Instant AI Diagnosis
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our vision model analyzes discoloration, lesion margins, and chlorosis to pinpoint the disease.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-3 shadow-sm hover:shadow transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Apply Safe Remedies
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive plain-English biological, organic, and cultural treatments to save your harvest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Supported Crops Showcase */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Crop Coverage
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Crops KrushiMitra protects
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated for common Indian crops and university extension pathogen guides.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SUPPORTED_CROPS.map((crop, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white hover:bg-emerald-50/30 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all text-center space-y-1.5"
              >
                <span className="text-3xl block">{crop.icon}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {crop.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {crop.diseases}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/disease-library"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              <span>Explore all 80+ crop diseases in the library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Clean Call To Action */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white text-center space-y-4 shadow-xl shadow-emerald-600/20">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to diagnose your crops?
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Start checking leaves for diseases, view local outbreak warnings, and get university-tested treatment guidelines.
            </p>
            <div className="pt-2">
              <Link
                to="/diagnose"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Camera className="w-4 h-4" />
                <span>Start Free Diagnosis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { LandingPage };

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
  Sparkles,
  BookOpen,
  Sprout,
  Check
} from "lucide-react";

const DEMO_CROPS = [
  {
    id: "tomato",
    crop: "Tomato",
    icon: "🍅",
    condition: "Early Blight",
    pathogen: "Alternaria solani",
    severity: "Moderate",
    severityBadge: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    confidence: "94%",
    symptoms: [
      "Concentric dark brown circular spots on lower leaves",
      "Yellow chlorotic halo spreading around leaf margins"
    ],
    treatment: "Remove infected lower leaves. Spray Trichoderma bio-agent or copper oxychloride solution as per ICAR guidelines.",
    source: "ICAR-IIHR Advisory Standards",
    svgIllustration: (
      <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 20 C130 50, 160 90, 150 140 C140 170, 115 185, 100 185 C85 185, 60 170, 50 140 C40 90, 70 50, 100 20 Z" fill="#22c55e" fillOpacity="0.85" stroke="#15803d" strokeWidth="2.5" />
        <path d="M100 20 L100 185" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M100 70 L135 55 M100 100 L145 85 M100 135 L135 125 M100 70 L65 55 M100 100 L55 85 M100 135 L65 125" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
        {/* Natural-looking Early Blight Spots */}
        <circle cx="125" cy="90" r="14" fill="#92400e" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="125" cy="90" r="7" fill="#78350f" />
        <circle cx="75" cy="130" r="11" fill="#92400e" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="1.8" />
        <circle cx="75" cy="130" r="5" fill="#78350f" />
      </svg>
    )
  },
  {
    id: "rice",
    crop: "Rice / Paddy",
    icon: "🌾",
    condition: "Leaf Blast",
    pathogen: "Magnaporthe oryzae",
    severity: "High",
    severityBadge: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    confidence: "91%",
    symptoms: [
      "Spindle-shaped elliptical lesions with gray centers",
      "Reddish-brown borders along narrow leaf blades"
    ],
    treatment: "Avoid excess nitrogen fertilizer. Maintain proper irrigation flow and apply Pseudomonas fluorescens bio-spray.",
    source: "ICAR-IIRR Rice Advisory",
    svgIllustration: (
      <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 15 C115 60, 120 120, 105 185 C100 188, 98 188, 95 185 C80 120, 85 60, 100 15 Z" fill="#16a34a" fillOpacity="0.85" stroke="#15803d" strokeWidth="2" />
        <path d="M100 15 L100 185" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
        {/* Spindle blast lesion */}
        <ellipse cx="100" cy="95" rx="8" ry="22" fill="#7f1d1d" fillOpacity="0.85" stroke="#dc2626" strokeWidth="1.5" />
        <ellipse cx="100" cy="95" rx="4" ry="12" fill="#f1f5f9" />
      </svg>
    )
  },
  {
    id: "cotton",
    crop: "Cotton",
    icon: "🌿",
    condition: "Healthy Foliage",
    pathogen: "Normal vegetative state",
    severity: "Healthy",
    severityBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    confidence: "98%",
    symptoms: [
      "Uniform vibrant green leaves with intact margins",
      "Zero sucking pest punctures or bacterial angular spots"
    ],
    treatment: "Maintain regular weekly field inspection. Continue standard drip irrigation and balanced nutrient feeding.",
    source: "ICAR-CICR Cotton Guidelines",
    svgIllustration: (
      <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 25 C120 40, 165 40, 160 85 C155 125, 140 150, 100 175 C60 150, 45 125, 40 85 C35 40, 80 40, 100 25 Z" fill="#22c55e" fillOpacity="0.9" stroke="#15803d" strokeWidth="2" />
        <path d="M100 25 L100 175" stroke="#166534" strokeWidth="2" />
        <path d="M100 70 L145 60 M100 110 L135 105 M100 70 L55 60 M100 110 L65 105" stroke="#166534" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "potato",
    crop: "Potato",
    icon: "🥔",
    condition: "Late Blight",
    pathogen: "Phytophthora infestans",
    severity: "Critical",
    severityBadge: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    confidence: "93%",
    symptoms: [
      "Water-soaked dark lesions spreading rapidly near tips",
      "White fungal downy growth on leaf undersides in high humidity"
    ],
    treatment: "Destroy heavily infected haulms. Ensure good field drainage and apply recommended ICAR-CPRI fungicide immediately.",
    source: "ICAR-CPRI Potato Standards",
    svgIllustration: (
      <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 25 C135 45, 155 85, 145 135 C135 165, 115 180, 100 180 C85 180, 65 165, 55 135 C45 85, 65 45, 100 25 Z" fill="#4ade80" fillOpacity="0.8" stroke="#15803d" strokeWidth="2" />
        <path d="M100 25 L100 180" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
        {/* Irregular water-soaked lesion */}
        <path d="M105 50 C125 55, 140 75, 130 95 C120 100, 105 85, 105 50 Z" fill="#3f3f46" fillOpacity="0.85" stroke="#71717a" strokeWidth="1.5" />
        <circle cx="80" cy="115" r="10" fill="#3f3f46" fillOpacity="0.75" />
      </svg>
    )
  }
];

const LandingPage = () => {
  const [selectedCrop, setSelectedCrop] = useState(DEMO_CROPS[0]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Clean Modern Hero */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Minimalist Announcement Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800 shadow-sm animate-fade-in">
              <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Smart Crop Health & Disease Diagnostics</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] animate-slide-up">
              Diagnose crop diseases early. <br />
              <span className="text-emerald-600 dark:text-emerald-400">
                Protect every harvest.
              </span>
            </h1>

            {/* Plain-English Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Snap a photo of any leaf or crop. KrushiMitra diagnoses potential diseases in seconds and delivers verified, safe remedies backed by ICAR standards.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/diagnose"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Diagnose Plant Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/disease-library"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Disease Library</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
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
          </div>

          {/* 2. Interactive SaaS Product Preview Card (Polished & Friendly) */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
              {/* Card Header with Crop Switcher */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 pl-2">
                    Live Diagnostic Preview
                  </span>
                </div>

                {/* Crop Tabs */}
                <div className="flex gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl">
                  {DEMO_CROPS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCrop(c)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        selectedCrop.id === c.id
                          ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span>{c.crop.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Content Showcase */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left: Clean Stylized Specimen */}
                <div className="md:col-span-5 bg-emerald-50/60 dark:bg-slate-900/60 rounded-2xl p-6 border border-emerald-100 dark:border-slate-700/80 flex flex-col items-center justify-center text-center">
                  <div className="py-2">
                    {selectedCrop.svgIllustration}
                  </div>
                  <span className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {selectedCrop.crop} Specimen
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    {selectedCrop.pathogen}
                  </span>
                </div>

                {/* Right: Diagnosis Details */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedCrop.severityBadge}`}>
                        {selectedCrop.severity}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
                        {selectedCrop.confidence} Confidence
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {selectedCrop.condition}
                    </h3>
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Identified Symptoms
                    </span>
                    <ul className="space-y-1">
                      {selectedCrop.symptoms.map((symptom, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Management */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Recommended Treatment</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedCrop.treatment}
                    </p>
                    <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium pt-0.5">
                      Source: {selectedCrop.source}
                    </span>
                  </div>

                  <div className="pt-1">
                    <Link
                      to="/diagnose"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 group"
                    >
                      <span>Upload your own photo for free</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Simple 3-Step Flow */}
      <section className="py-16 bg-white dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Simple Workflow
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How KrushiMitra works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Snap or Upload Photo
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Take a clear picture of the affected leaf, fruit, or plant with your smartphone or computer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Instant Vision AI
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our vision models analyze lesion shapes, discoloration, and halos in sub-second inference.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Safe, Verified Care
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive organic and cultural remedies verified against official ICAR agricultural research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities (Only 4 Essential Clean Cards) */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Platform Features
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Built for farmers, students & agronomists
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Visual Disease Diagnostics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Fast, reliable pathological evaluation covering Rice, Cotton, Soybean, Maize, Tomato, Potato, and Chilli.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Chemical Hallucinations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Treatment guidelines are decoupled from generative text and validated directly against institutional research.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Agro-Weather Alerts
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track humidity, dew points, and temperature spikes to forecast fungal blight risks before symptoms spread.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Community Outbreak Map
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive map displaying localized reports from neighboring farms to help prevent regional epidemics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean, Welcoming Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-emerald-600 text-white text-center space-y-4 shadow-lg shadow-emerald-600/20">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to test your crop leaves?
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto">
              Try our instant diagnosis studio, explore the disease library, or check real-time weather risk advisories.
            </p>
            <div className="pt-2">
              <Link
                to="/diagnose"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 shadow transition-colors"
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


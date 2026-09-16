import { Link } from "react-router-dom";
import {
  Camera,
  ShieldCheck,
  CloudSun,
  BookOpen,
  Bot,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Activity
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: Camera,
      title: "Groq AI Vision Diagnosis",
      desc: "Rapidly evaluate foliar lesions, chlorosis, and pest markings with sub-second vision inference."
    },
    {
      icon: ShieldCheck,
      title: "ICAR & University Grounded",
      desc: "Management protocols verified against official ICAR, TNAU, and agricultural extension recommendations."
    },
    {
      icon: CloudSun,
      title: "Agro-Weather Risk Matrix",
      desc: "Track humidity, leaf wetness, and temperature triggers that spark fungal blast and blight epidemics."
    },
    {
      icon: BookOpen,
      title: "Interactive Disease Encyclopedia",
      desc: "Search 15+ comprehensive profiles across Rice, Cotton, Soybean, Maize, Tomato, and Chilli."
    },
    {
      icon: MapPin,
      title: "Geospatial Outbreak Mapping",
      desc: "Community field reports mapped on OpenStreetMap to monitor local contagion before it spreads."
    },
    {
      icon: Bot,
      title: "KrushiMitra AI Assistant",
      desc: "Natural language agricultural question-answering with citation references and IPM guidance."
    }
  ];
  const workflowSteps = [
    {
      step: "01",
      title: "Capture or Upload Specimen",
      desc: "Take a clear photograph of the affected leaf, stem, or square on your mobile or computer."
    },
    {
      step: "02",
      title: "Deep Vision Assessment",
      desc: "Groq vision models analyze color patterns, halo margins, necrotic rings, and pest frass."
    },
    {
      step: "03",
      title: "Verified Guidance & Action",
      desc: "Receive clear severity grading, cultural practices, bio-control solutions, and extension advice."
    }
  ];
  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors">{
    /* Hero Section */
  }<section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800"><div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),theme(colors.slate.50))] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.950/40),theme(colors.slate.950))] opacity-70" /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center max-w-3xl mx-auto space-y-6"><div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide border border-emerald-300/60 dark:border-emerald-800 shadow-sm"><Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /><span>Next-Generation Agricultural Diagnostic Intelligence</span></div><h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Krushi<span className="text-emerald-600 dark:text-emerald-400">Mitra</span><span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-700 dark:text-slate-300 mt-2">
                AI Crop Health & Diagnostic Assistant
              </span></h1><p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Upload a crop image and get an AI-powered assessment of possible diseases, pests, symptoms, and crop-health risks backed by verified ICAR standards.
            </p><div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"><Link
    to="/diagnose"
    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all"
  ><Camera className="w-4 h-4" />
                Diagnose Crop Now
                <ArrowRight className="w-4 h-4" /></Link><Link
    to={isAuthenticated ? "/dashboard" : "/login"}
    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm transition-all"
  ><Activity className="w-4 h-4 text-emerald-600" />{isAuthenticated ? "Open Dashboard" : "Explore Platform Demo"}</Link></div>{
    /* Quick trust metrics */
  }<div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500 dark:text-slate-400"><span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 6 Major Cash & Food Crops
              </span><span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ICAR Extension Grounded
              </span><span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ultra-Fast Groq Vision
              </span></div></div>{
    /* Interactive Diagnostic Preview Mockup */
  }<div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 transition-all"><div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 text-xs font-semibold text-slate-500"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-amber-400" /><span className="w-3 h-3 rounded-full bg-emerald-400" /><span className="ml-2 font-mono text-slate-400">Live AI Vision Diagnostic Interface</span></div><span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">Model: Llama 3.2 Vision</span></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"><div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-52 flex items-center justify-center"><img
    src="https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=500&auto=format&fit=crop&q=80"
    alt="Sample Tomato Leaf"
    className="w-full h-full object-cover"
  /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3"><span className="text-white text-xs font-bold">Tomato Leaf Specimen</span></div></div><div className="md:col-span-2 space-y-3"><div className="flex items-center justify-between"><span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    Tomato • Foliage
                  </span><span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200">
                    Moderate Severity
                  </span></div><h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Early Blight (Alternaria solani)
                </h3><p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Concentric brown target rings identified on lower leaf margins. Pathogen thrives under warm humid cycles with prolonged dew.
                </p><div className="pt-1 flex items-center gap-3"><div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Confidence: 89%
                  </div><span className="text-slate-300 dark:text-slate-700">|</span><div className="text-xs text-slate-500">
                    Source: ICAR-IIHR Extension Portal
                  </div></div></div></div></div></div></section>{
    /* 3-Step Diagnostic Workflow */
  }<section className="py-16 bg-white dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center max-w-2xl mx-auto mb-12 space-y-2"><h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Streamlined Diagnostic Flow
            </h2><p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How KrushiMitra Works
            </p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{workflowSteps.map((s, idx) => <div
    key={idx}
    className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors"
  ><div className="text-4xl font-black text-emerald-500/30 mb-3">{s.step}</div><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3><p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p></div>)}</div></div></section>{
    /* Features Grid */
  }<section className="py-20"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center max-w-2xl mx-auto mb-14 space-y-2"><h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Comprehensive Agro-Intelligence
            </h2><p className="text-3xl font-black text-slate-900 dark:text-white">
              Built for Modern Agricultural Protection
            </p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{features.map((feat, idx) => {
    const Icon = feat.icon;
    return <div
      key={idx}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-emerald-500/40 transition-all group"
    ><div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icon className="w-6 h-6" /></div><h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3><p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p></div>;
  })}</div></div></section>{
    /* Call to Action Banner */
  }<section className="py-16 bg-gradient-to-tr from-emerald-700 to-emerald-900 text-white"><div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6"><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to inspect your crops with AI?
          </h2><p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto">
            Try the instant diagnosis studio, review the disease library, or explore real-time weather risk advisories now.
          </p><div className="pt-2 flex flex-wrap items-center justify-center gap-4"><Link
    to="/diagnose"
    className="px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
  >
              Start Free Diagnosis
            </Link><Link
    to="/disease-library"
    className="px-6 py-3.5 rounded-xl bg-emerald-800/80 border border-emerald-500/40 text-white font-bold text-sm hover:bg-emerald-800 transition-colors"
  >
              Browse Disease Library
            </Link></div></div></section></div>;
};
export {
  LandingPage
};

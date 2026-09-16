import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldAlert, BookCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors mt-auto">
      {/* Alert / Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Academic Project Notice:</strong> AI assessments are informative guidance. For certified chemical dosages and field treatment, always consult a qualified Krishi Vigyan Kendra (KVK) officer.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Krushi<span className="text-emerald-500 font-extrabold">Mitra</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              An intelligent crop disease and pest diagnostic platform integrating Groq Vision, meteorology, and verified agricultural extension data.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <BookCheck className="w-4 h-4" />
              <span>Grounded in ICAR & TNAU Standards</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/diagnose" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Crop Diagnosis</Link></li>
              <li><Link to="/disease-library" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Disease & Pest Library</Link></li>
              <li><Link to="/weather-risk" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Weather Risk Forecaster</Link></li>
              <li><Link to="/field-reports" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Outbreak Community Map</Link></li>
              <li><Link to="/assistant" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Agri-Advisor Chat</Link></li>
            </ul>
          </div>

          {/* Col 3: Research Sources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Verified Sources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://icar.org.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400">
                  ICAR Headquarters <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://agritech.tnau.ac.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400">
                  TNAU Agritech Portal <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://iihr.res.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400">
                  ICAR-IIHR Bengaluru <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://cicr.icar.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400">
                  ICAR-CICR Cotton <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Academic Project
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Built with MERN Stack, Groq Llama 3.2 Vision, Leaflet Maps, and Open-Meteo Meteorology.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              Department of Information Technology & Computer Science
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} KrushiMitra. Open-Source Educational Project.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered for sustainable agricultural protection
          </p>
        </div>
      </div>
    </footer>
  );
};

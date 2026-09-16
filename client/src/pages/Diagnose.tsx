import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  X,
  Sparkles,
  AlertCircle,
  FileImage,
  Info,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { diagnosisApi } from '../services/api';
import { DiagnosisResult } from '../types';
import { AnalysisAnimation } from '../components/diagnosis/AnalysisAnimation';
import { DiagnosisResultCard } from '../components/diagnosis/DiagnosisResultCard';

// Sample demo specimen images for 1-click evaluator testing
const SAMPLE_SPECIMENS = [
  {
    name: 'Tomato Early Blight Specimen',
    crop: 'Tomato',
    notes: 'Concentric target spots on lower foliage with yellow halos',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=700&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rice Leaf Blast Specimen',
    crop: 'Rice',
    notes: 'Spindle shaped necrotic lesions on upper leaves',
    url: 'https://images.unsplash.com/photo-1536617621972-60253e485e35?w=700&auto=format&fit=crop&q=80'
  },
  {
    name: 'Healthy Cotton Plant',
    crop: 'Cotton',
    notes: 'Clean vegetative growth, no signs of sucking pests',
    url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=700&auto=format&fit=crop&q=80'
  }
];

export const Diagnose: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('auto');
  const [notes, setNotes] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    setError('');
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload an image file (JPG, PNG, or WEBP).');
      return;
    }
    // Validate size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSampleSpecimen = async (sample: typeof SAMPLE_SPECIMENS[0]) => {
    setError('');
    setSelectedCrop(sample.crop);
    setNotes(sample.notes);

    try {
      // Fetch sample image and convert to File
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const sampleFile = new File([blob], `${sample.crop.toLowerCase()}_sample.jpg`, { type: 'image/jpeg' });
      setFile(sampleFile);
      setPreviewUrl(sample.url);
    } catch (e) {
      // Fallback preview
      setPreviewUrl(sample.url);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !previewUrl) {
      setError('Please upload an image of the plant leaf or select a sample specimen.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      let submitFile = file;
      if (!submitFile && previewUrl) {
        // Fetch preview blob
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        submitFile = new File([blob], 'specimen.jpg', { type: 'image/jpeg' });
      }

      const formData = new FormData();
      formData.append('image', submitFile!);
      if (selectedCrop && selectedCrop !== 'auto') {
        formData.append('crop', selectedCrop);
      }
      if (notes) {
        formData.append('notes', notes);
      }
      formData.append('save', 'true');

      const response = await diagnosisApi.analyze(formData);

      if (response.data.success && response.data.data) {
        setResult(response.data.data);
      } else {
        throw new Error('Analysis completed but did not yield structured findings.');
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to process the image with vision AI. Please ensure the image clearly shows the affected leaf.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setResult(null);
    setFile(null);
    setPreviewUrl(null);
    setNotes('');
    setSelectedCrop('auto');
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Groq Llama 3.2 Vision Diagnostic Studio</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Crop Health Image Diagnosis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload a high-resolution photograph of affected plant leaves to detect foliar diseases, fungal blights, and pest infestations.
        </p>
      </div>

      {/* When analysis is active */}
      {isAnalyzing && <AnalysisAnimation />}

      {/* When analysis is complete */}
      {!isAnalyzing && result && (
        <DiagnosisResultCard result={result} onReset={resetAll} isSavedInitial={true} />
      )}

      {/* Upload Interface when not analyzing and no result */}
      {!isAnalyzing && !result && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Quick Sample Selector for Easy College Demo */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                Quick Test: Load Pre-configured Specimen
              </span>
              <span className="text-[10px] text-slate-400">1-Click Evaluation Mode</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_SPECIMENS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSampleSpecimen(s)}
                  className="p-2.5 rounded-xl text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors group"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{s.notes}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Upload Box */}
          <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Dropzone or Preview */}
            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer space-y-4"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to select or drag and drop crop photo
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 max-h-96 flex items-center justify-center group">
                <img
                  src={previewUrl}
                  alt="Crop Preview"
                  className="w-full h-80 object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-md"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur">
                  Specimen Ready for Vision AI
                </div>
              </div>
            )}

            {/* Inputs: Crop selection & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Crop Type
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="auto">Auto-detect from image</option>
                  <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                  <option value="Rice">Rice / Paddy (Oryza sativa)</option>
                  <option value="Cotton">Cotton (Gossypium hirsutum)</option>
                  <option value="Soybean">Soybean (Glycine max)</option>
                  <option value="Maize">Maize / Corn (Zea mays)</option>
                  <option value="Chilli">Chilli / Pepper (Capsicum annuum)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Visible Symptoms or Context (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yellow halos on lower leaves, noticed after rain..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!previewUrl || isAnalyzing}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                previewUrl
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 hover:-translate-y-0.5'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Initiate AI Vision Diagnosis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

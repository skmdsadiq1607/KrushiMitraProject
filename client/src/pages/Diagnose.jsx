import { useState, useRef } from "react";
import {
  UploadCloud,
  Camera,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { diagnosisApi } from "../services/api";
import { AnalysisAnimation } from "../components/diagnosis/AnalysisAnimation";
import { DiagnosisResultCard } from "../components/diagnosis/DiagnosisResultCard";
const SAMPLE_SPECIMENS = [
  {
    name: "Tomato Early Blight Specimen",
    crop: "Tomato",
    notes: "Concentric target spots on lower foliage with yellow halos",
    url: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=700&auto=format&fit=crop&q=80"
  },
  {
    name: "Rice Leaf Blast Specimen",
    crop: "Rice",
    notes: "Spindle shaped necrotic lesions on upper leaves",
    url: "https://images.unsplash.com/photo-1536617621972-60253e485e35?w=700&auto=format&fit=crop&q=80"
  },
  {
    name: "Healthy Cotton Plant",
    crop: "Cotton",
    notes: "Clean vegetative growth, no signs of sucking pests",
    url: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=700&auto=format&fit=crop&q=80"
  }
];
const Diagnose = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("auto");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = (selectedFile) => {
    setError("");
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload an image file (JPG, PNG, or WEBP).");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds the 10MB limit.");
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const loadSampleSpecimen = async (sample) => {
    setError("");
    setSelectedCrop(sample.crop);
    setNotes(sample.notes);
    try {
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const sampleFile = new File([blob], `${sample.crop.toLowerCase()}_sample.jpg`, { type: "image/jpeg" });
      setFile(sampleFile);
      setPreviewUrl(sample.url);
    } catch (e) {
      setPreviewUrl(sample.url);
    }
  };
  const handleAnalyze = async () => {
    if (!file && !previewUrl) {
      setError("Please upload an image of the plant leaf or select a sample specimen.");
      return;
    }
    setIsAnalyzing(true);
    setError("");
    try {
      let submitFile = file;
      if (!submitFile && previewUrl) {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        submitFile = new File([blob], "specimen.jpg", { type: "image/jpeg" });
      }
      const formData = new FormData();
      formData.append("image", submitFile);
      if (selectedCrop && selectedCrop !== "auto") {
        formData.append("crop", selectedCrop);
      }
      if (notes) {
        formData.append("notes", notes);
      }
      formData.append("save", "true");
      const response = await diagnosisApi.analyze(formData);
      if (response.data.success && response.data.data) {
        setResult(response.data.data);
      } else {
        throw new Error("Analysis completed but did not yield structured findings.");
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      setError(
        err.response?.data?.message || "Unable to process the image with vision AI. Please ensure the image clearly shows the affected leaf."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };
  const resetAll = () => {
    setResult(null);
    setFile(null);
    setPreviewUrl(null);
    setNotes("");
    setSelectedCrop("auto");
    setError("");
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Clean Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800/80 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Instant Plant Health Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Diagnose Plant Specimen
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload a clear photo of the leaf or crop to detect diseases, pests, and safe treatment steps.
        </p>
      </div>

      {/* Analysis Active State */}
      {isAnalyzing && <AnalysisAnimation />}

      {/* Analysis Complete Result */}
      {!isAnalyzing && result && (
        <DiagnosisResultCard result={result} onReset={resetAll} isSavedInitial={true} />
      )}

      {/* Upload Interface */}
      {!isAnalyzing && !result && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Quick Demo Specimen Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Try a sample leaf:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_SPECIMENS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSampleSpecimen(s)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 text-[11px] font-medium transition-colors"
                >
                  {s.crop}: {s.name.split(" ")[1] || s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Upload Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
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
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 rounded-2xl p-10 text-center transition-all cursor-pointer space-y-3"
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
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Click to browse or drop your plant photo here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 h-72 flex items-center justify-center group">
                <img
                  src={previewUrl}
                  alt="Crop Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-medium backdrop-blur">
                  Image ready for diagnosis
                </div>
              </div>
            )}

            {/* Target Crop & Optional Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Crop
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="auto">Auto-detect from image</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Rice">Rice / Paddy</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Maize">Maize / Corn</option>
                  <option value="Chilli">Chilli / Pepper</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes / Symptoms (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yellow halos on lower leaves..."
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
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow transition-all ${
                previewUrl
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:-translate-y-0.5"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Analyze Plant Health</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export {
  Diagnose
};

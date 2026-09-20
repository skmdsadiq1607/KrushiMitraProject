import { useState, useRef } from "react";
import {
  UploadCloud,
  Camera,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileText
} from "lucide-react";
import { diagnosisApi } from "../services/api";
import { AnalysisAnimation } from "../components/diagnosis/AnalysisAnimation";
import { DiagnosisResultCard } from "../components/diagnosis/DiagnosisResultCard";

const SAMPLE_SPECIMENS = [
  {
    name: "Tomato Early Blight",
    crop: "Tomato",
    notes: "Concentric target spots on lower foliage with yellow halos"
  },
  {
    name: "Rice Leaf Blast",
    crop: "Rice",
    notes: "Spindle shaped necrotic lesions on upper leaves"
  },
  {
    name: "Healthy Cotton",
    crop: "Cotton",
    notes: "Clean vegetative growth, no signs of sucking pests"
  }
];

const generateSpecimenImage = (crop) => {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Natural warm background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, 480, 480);

  // Stalk
  ctx.strokeStyle = "#166534";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(240, 50);
  ctx.quadraticCurveTo(235, 240, 240, 430);
  ctx.stroke();

  // Leaf shape
  ctx.fillStyle = crop === "Rice" ? "#16a34a" : "#22c55e";
  ctx.beginPath();
  if (crop === "Rice") {
    ctx.ellipse(240, 230, 55, 180, 0, 0, Math.PI * 2);
  } else {
    ctx.moveTo(240, 60);
    ctx.bezierCurveTo(380, 120, 370, 310, 240, 410);
    ctx.bezierCurveTo(110, 310, 100, 120, 240, 60);
  }
  ctx.fill();

  // Veins
  ctx.strokeStyle = "#15803d";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Lateral veins
  ctx.strokeStyle = "#166534";
  ctx.lineWidth = 2;
  for (let i = 120; i < 350; i += 45) {
    ctx.beginPath();
    ctx.moveTo(240, i);
    ctx.lineTo(crop === "Rice" ? 275 : 330, i - 25);
    ctx.moveTo(240, i);
    ctx.lineTo(crop === "Rice" ? 205 : 150, i - 25);
    ctx.stroke();
  }

  // Symptoms
  if (crop === "Tomato") {
    // Early Blight concentric rings
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.arc(280, 200, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#451a03";
    ctx.beginPath();
    ctx.arc(280, 200, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.arc(190, 280, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3.5;
    ctx.stroke();
  } else if (crop === "Rice") {
    // Rice blast spindle
    ctx.fillStyle = "#7f1d1d";
    ctx.beginPath();
    ctx.ellipse(240, 210, 16, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.ellipse(240, 210, 7, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL("image/jpeg", 0.92);
};

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
      const dataUrl = generateSpecimenImage(sample.crop);
      if (dataUrl) {
        setPreviewUrl(dataUrl);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const sampleFile = new File([blob], `${sample.crop.toLowerCase()}_specimen.jpg`, { type: "image/jpeg" });
        setFile(sampleFile);
      }
    } catch (e) {
      console.error("Sample load error:", e);
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
        err.response?.data?.message ||
          "Unable to process the image with vision AI. Please ensure the image clearly shows the affected leaf."
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
          <span>Plant Health Diagnostics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Diagnose Plant Specimen
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload a clear photo of the leaf or crop to detect diseases, pests, and safe ICAR remedies.
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Try a sample leaf:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SPECIMENS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSampleSpecimen(s)}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300 text-xs font-semibold transition-all shadow-sm"
                >
                  {s.crop} ({s.name.replace(s.crop, "").trim()})
                </button>
              ))}
            </div>
          </div>

          {/* Main Upload Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
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
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 rounded-2xl p-10 text-center transition-all cursor-pointer space-y-3"
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
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
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

            {/* Target Crop & Optional Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Crop
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!previewUrl || isAnalyzing}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow transition-all ${
                previewUrl
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:-translate-y-0.5 cursor-pointer"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
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

export { Diagnose };

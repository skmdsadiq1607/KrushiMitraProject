import { Diagnosis } from '../models/Diagnosis.js';
import { analyzeCropImage } from '../services/groqService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory fallback history for demo
let inMemoryDiagnoses = [];

// Pre-load demo diagnoses
try {
  const demoPath = path.resolve(__dirname, '../../../data/demo/sampleDiagnoses.json');
  if (fs.existsSync(demoPath)) {
    inMemoryDiagnoses = JSON.parse(fs.readFileSync(demoPath, 'utf-8'));
  }
} catch (e) {
  // Ignore
}

// @desc   Analyze crop leaf image via Groq Vision
// @route  POST /api/diagnosis/analyze
export const analyzeCrop = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded. Please upload a clear photo of the crop leaf or plant.'
      });
    }

    const { crop, notes, save } = req.body;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Call Groq Vision analysis service
    const analysisResult = await analyzeCropImage({
      imageBuffer,
      mimeType,
      cropHint: crop,
      notes
    });

    // Create a base64 thumbnail preview for saving/displaying
    const base64Data = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    analysisResult.imageUrl = base64Data;
    analysisResult.createdAt = new Date().toISOString();

    // Auto-save if requested and user is authenticated
    if (save === 'true' || save === true) {
      const savedDoc = await persistDiagnosis(analysisResult, req.user?._id || req.user?.id, notes);
      analysisResult._id = savedDoc._id || savedDoc.id;
    }

    return res.status(200).json({
      success: true,
      data: analysisResult
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Save a completed diagnosis to history
// @route  POST /api/diagnosis/save
export const saveDiagnosis = async (req, res, next) => {
  try {
    const analysisData = req.body;
    const userId = req.user?._id || req.user?.id;

    const saved = await persistDiagnosis(analysisData, userId, analysisData.userNotes || '');

    return res.status(201).json({
      success: true,
      message: 'Diagnosis saved to your field history.',
      data: saved
    });
  } catch (err) {
    next(err);
  }
};

// Helper to save to Mongo or in-memory fallback
async function persistDiagnosis(data, userId, notes) {
  const payload = {
    userId: userId || null,
    crop: data.crop || 'Unknown Crop',
    plantPart: data.plantPart || 'Leaf',
    condition: data.condition || data.problem || 'Analyzed Specimen',
    problem: data.problem || data.condition || 'Analyzed Specimen',
    conditionType: data.conditionType || data.problemType || 'disease',
    confidence: data.confidence || 85,
    severity: data.severity || 'Moderate',
    isHealthy: !!data.isHealthy,
    visibleSymptoms: data.visibleSymptoms || data.symptoms || [],
    symptoms: data.symptoms || data.visibleSymptoms || [],
    possibleCauses: data.possibleCauses || [],
    alternativePossibilities: data.alternativePossibilities || [],
    imageQuality: data.imageQuality || 'good',
    expertConfirmationRequired: data.expertConfirmationRequired !== false,
    additionalInformationNeeded: data.additionalInformationNeeded || [],
    management: data.management || [],
    prevention: data.prevention || [],
    verifiedSource: data.verifiedSource || '',
    treatmentNotice: data.treatmentNotice || null,
    isDemo: !!data.isDemo,
    demoNotice: data.demoNotice || null,
    expertAdvice: data.expertAdvice || 'Consult local KVK for verified advisory.',
    disclaimer: data.disclaimer || 'Informational AI assessment.',
    imageUrl: data.imageUrl || '',
    userNotes: notes || ''
  };

  try {
    const newDoc = await Diagnosis.create(payload);
    return newDoc;
  } catch (dbErr) {
    // In-memory fallback
    const mockDoc = {
      _id: 'diag-' + Date.now(),
      id: 'diag-' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString()
    };
    inMemoryDiagnoses.unshift(mockDoc);
    return mockDoc;
  }
}

// @desc   Get user diagnosis history
// @route  GET /api/diagnosis/history
export const getHistory = async (req, res, next) => {
  try {
    const { crop, severity, search } = req.query;
    let records = [];

    try {
      const query = {};
      if (req.user?._id) {
        query.userId = req.user._id;
      }
      if (crop && crop !== 'all') {
        query.crop = new RegExp(crop, 'i');
      }
      if (severity && severity !== 'all') {
        query.severity = severity;
      }
      if (search) {
        query.problem = new RegExp(search, 'i');
      }

      records = await Diagnosis.find(query).sort({ createdAt: -1 }).limit(50);
    } catch (e) {
      records = [];
    }

    // If MongoDB yielded no records or is offline, supply in-memory + demo records
    if (records.length === 0) {
      let filtered = [...inMemoryDiagnoses];
      if (crop && crop !== 'all') {
        filtered = filtered.filter(r => r.crop?.toLowerCase().includes(crop.toLowerCase()));
      }
      if (severity && severity !== 'all') {
        filtered = filtered.filter(r => r.severity === severity);
      }
      if (search) {
        filtered = filtered.filter(r => r.problem?.toLowerCase().includes(search.toLowerCase()) || r.crop?.toLowerCase().includes(search.toLowerCase()));
      }
      records = filtered;
    }

    return res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single diagnosis by ID
// @route  GET /api/diagnosis/:id
export const getDiagnosisById = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const doc = await Diagnosis.findById(id);
      if (doc) {
        return res.json({ success: true, data: doc });
      }
    } catch (e) {
      // Check in-memory
    }

    const item = inMemoryDiagnoses.find(d => (d._id === id || d.id === id));
    if (item) {
      return res.json({ success: true, data: item });
    }

    return res.status(404).json({ success: false, message: 'Diagnosis record not found.' });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete diagnosis
// @route  DELETE /api/diagnosis/:id
export const deleteDiagnosis = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await Diagnosis.findByIdAndDelete(id);
    } catch (e) {
      // Mongo offline
    }

    inMemoryDiagnoses = inMemoryDiagnoses.filter(d => d._id !== id && d.id !== id);

    return res.json({ success: true, message: 'Diagnosis record removed successfully.' });
  } catch (err) {
    next(err);
  }
};

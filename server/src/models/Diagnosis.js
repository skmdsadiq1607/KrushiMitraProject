import mongoose from 'mongoose';

const diagnosisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  crop: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  plantPart: {
    type: String,
    default: 'Leaf / Foliage'
  },
  condition: {
    type: String,
    default: ''
  },
  problem: {
    type: String,
    required: [true, 'Diagnosis/Problem name is required']
  },
  conditionType: {
    type: String,
    default: 'disease'
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate'
  },
  isHealthy: {
    type: Boolean,
    default: false
  },
  visibleSymptoms: [{ type: String }],
  symptoms: [{ type: String }],
  possibleCauses: [{ type: String }],
  alternativePossibilities: [{ type: String }],
  imageQuality: {
    type: String,
    default: 'good'
  },
  expertConfirmationRequired: {
    type: Boolean,
    default: true
  },
  additionalInformationNeeded: [{ type: String }],
  // Verified Knowledge-Base Management
  management: [{ type: String }],
  prevention: [{ type: String }],
  verifiedSource: {
    type: String,
    default: ''
  },
  treatmentNotice: {
    type: String,
    default: null
  },
  // Demo indicator
  isDemo: {
    type: Boolean,
    default: false
  },
  demoNotice: {
    type: String,
    default: null
  },
  expertAdvice: {
    type: String,
    default: 'Consult a local agricultural extension officer (KVK) for on-field verification.'
  },
  disclaimer: {
    type: String,
    default: 'This is an AI-assisted visual assessment and should be verified with a certified agronomist before applying chemical treatments.'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  location: {
    lat: Number,
    lng: Number,
    name: String
  },
  userNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for user history retrieval
diagnosisSchema.index({ userId: 1, createdAt: -1 });

export const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  scientificName: {
    type: String,
    default: ''
  },
  crop: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Disease', 'Pest', 'Nutrient deficiency', 'Environmental stress'],
    default: 'Disease'
  },
  pathogen: {
    type: String,
    default: ''
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate'
  },
  diseaseCycle: {
    type: String,
    default: ''
  },
  symptoms: [{ type: String }],
  causes: [{ type: String }],
  favorableConditions: {
    temperature: String,
    humidity: String,
    weatherFactor: String
  },
  prevention: [{ type: String }],
  management: [{ type: String }],
  preventionProtocol: {
    seedTreatment: [{ type: String }],
    culturalPractices: [{ type: String }],
    vectorAndPhysical: [{ type: String }],
    resistantCultivars: [{ type: String }]
  },
  curativeProtocol: {
    biologicalCure: [{ type: String }],
    chemicalCure: [
      {
        chemical: String,
        dosage: String,
        method: String,
        waitingPeriodDays: Number,
        precautions: String
      }
    ],
    sanitation: [{ type: String }]
  },
  source: {
    type: String,
    default: 'ICAR / TNAU Advisory'
  }
});

diseaseSchema.index({ crop: 1, type: 1 });

export const Disease = mongoose.model('Disease', diseaseSchema);

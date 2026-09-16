import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
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
  category: {
    type: String,
    default: 'General'
  },
  season: {
    type: String,
    default: 'Kharif / Rabi'
  },
  description: {
    type: String,
    default: ''
  },
  growthStages: [{ type: String }],
  optimalConditions: {
    temperature: String,
    humidity: String,
    soil: String,
    rainfall: String
  },
  vulnerabilities: [{ type: String }],
  source: {
    type: String,
    default: 'ICAR Advisory'
  }
});

export const Crop = mongoose.model('Crop', cropSchema);

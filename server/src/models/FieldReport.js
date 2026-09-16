import mongoose from 'mongoose';

const fieldReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  reporterName: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true
  },
  crop: {
    type: String,
    required: [true, 'Crop is required']
  },
  issue: {
    type: String,
    required: [true, 'Observed issue title is required']
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Moderate'
  },
  description: {
    type: String,
    required: [true, 'Field description is required']
  },
  location: {
    region: { type: String, default: 'Local Farm' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Reported', 'Under Review', 'Verified', 'Action Required', 'Resolved'],
    default: 'Reported'
  },
  isDemo: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

fieldReportSchema.index({ 'location.lat': 1, 'location.lng': 1 });

export const FieldReport = mongoose.model('FieldReport', fieldReportSchema);

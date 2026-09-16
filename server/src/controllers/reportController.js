import { FieldReport } from '../models/FieldReport.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let inMemoryReports = [];

try {
  const reportsPath = path.resolve(__dirname, '../../../data/demo/sampleReports.json');
  if (fs.existsSync(reportsPath)) {
    inMemoryReports = JSON.parse(fs.readFileSync(reportsPath, 'utf-8'));
  }
} catch (e) {}

// @desc   Submit a new crop health field report
// @route  POST /api/reports
export const createReport = async (req, res, next) => {
  try {
    const { reporterName, crop, issue, severity, description, location, imageUrl } = req.body;

    if (!reporterName || !crop || !issue || !description || !location || location.lat === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reporter name, crop, issue, description, and valid GPS coordinates.'
      });
    }

    try {
      const report = await FieldReport.create({
        userId: req.user?._id || req.user?.id || null,
        reporterName,
        crop,
        issue,
        severity: severity || 'Moderate',
        description,
        location: {
          region: location.region || 'Local Farm Field',
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng)
        },
        imageUrl: imageUrl || '',
        status: 'Reported',
        isDemo: false,
        date: new Date()
      });

      return res.status(201).json({ success: true, data: report });
    } catch (dbErr) {
      // In-memory fallback
      const mockReport = {
        _id: 'report-' + Date.now(),
        id: 'report-' + Date.now(),
        reporterName,
        crop,
        issue,
        severity: severity || 'Moderate',
        description,
        location: {
          region: location.region || 'Local Farm Field',
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng)
        },
        imageUrl: imageUrl || '',
        status: 'Reported',
        isDemo: false,
        date: new Date().toISOString()
      };
      inMemoryReports.unshift(mockReport);
      return res.status(201).json({ success: true, data: mockReport });
    }
  } catch (err) {
    next(err);
  }
};

// @desc   Get all field reports for map and list
// @route  GET /api/reports
export const getReports = async (req, res, next) => {
  try {
    let reports = [];
    try {
      reports = await FieldReport.find({}).sort({ date: -1 }).limit(100);
    } catch (e) {}

    if (!reports || reports.length === 0) {
      reports = inMemoryReports;
    }

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single report
// @route  GET /api/reports/:id
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let report = null;

    try {
      report = await FieldReport.findById(id);
    } catch (e) {}

    if (!report) {
      report = inMemoryReports.find(r => r._id === id || r.id === id);
    }

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete report
// @route  DELETE /api/reports/:id
export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await FieldReport.findByIdAndDelete(id);
    } catch (e) {}

    inMemoryReports = inMemoryReports.filter(r => r._id !== id && r.id !== id);

    res.json({ success: true, message: 'Report deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

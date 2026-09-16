import express from 'express';
import multer from 'multer';
import {
  analyzeCrop,
  saveDiagnosis,
  getHistory,
  getDiagnosisById,
  deleteDiagnosis
} from '../controllers/diagnosisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer memory storage
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, PNG, and WEBP images are supported.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// Optional auth helper: if bearer token exists, attaches user without blocking if absent
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
};

router.post('/analyze', optionalAuth, upload.single('image'), analyzeCrop);
router.post('/save', optionalAuth, saveDiagnosis);
router.get('/history', optionalAuth, getHistory);
router.get('/:id', getDiagnosisById);
router.delete('/:id', optionalAuth, deleteDiagnosis);

export default router;

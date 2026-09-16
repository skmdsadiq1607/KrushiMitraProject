import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  deleteReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, createReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.delete('/:id', optionalAuth, deleteReport);

export default router;

import express from 'express';
import { getDiseasesList, getDiseaseById } from '../controllers/diseaseController.js';

const router = express.Router();

router.get('/', getDiseasesList);
router.get('/:id', getDiseaseById);

export default router;

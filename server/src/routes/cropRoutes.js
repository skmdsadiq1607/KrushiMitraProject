import express from 'express';
import { getAllCrops, getCropById } from '../controllers/cropController.js';

const router = express.Router();

router.get('/', getAllCrops);
router.get('/:id', getCropById);

export default router;

import { getCrops } from '../services/knowledgeService.js';
import { Crop } from '../models/Crop.js';

// @desc   Get list of all supported crops
// @route  GET /api/crops
export const getAllCrops = async (req, res, next) => {
  try {
    let crops = [];
    try {
      crops = await Crop.find({});
    } catch (e) {}

    if (!crops || crops.length === 0) {
      crops = getCrops();
    }

    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single crop details
// @route  GET /api/crops/:id
export const getCropById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let crop = null;

    try {
      crop = await Crop.findOne({ $or: [{ id }, { _id: id }] });
    } catch (e) {}

    if (!crop) {
      const all = getCrops();
      crop = all.find(c => c.id.toLowerCase() === id.toLowerCase() || c.name.toLowerCase() === id.toLowerCase());
    }

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found in knowledge base.' });
    }

    res.json({ success: true, data: crop });
  } catch (err) {
    next(err);
  }
};

import { getDiseases, getSources } from '../services/knowledgeService.js';
import { Disease } from '../models/Disease.js';

// @desc   Get searchable disease and pest library
// @route  GET /api/diseases
export const getDiseasesList = async (req, res, next) => {
  try {
    const { crop, type, search } = req.query;

    let diseases = [];
    try {
      const query = {};
      if (crop && crop !== 'all') query.crop = new RegExp(crop, 'i');
      if (type && type !== 'all') query.type = type;
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { scientificName: new RegExp(search, 'i') },
          { symptoms: new RegExp(search, 'i') }
        ];
      }
      diseases = await Disease.find(query);
    } catch (e) {}

    // Fallback to in-memory knowledge base if Mongo returned 0 records or is offline
    if (!diseases || diseases.length === 0) {
      let list = getDiseases();
      if (crop && crop !== 'all') {
        list = list.filter(d => d.crop.toLowerCase().includes(crop.toLowerCase()) || d.crop.toLowerCase() === 'general / all crops');
      }
      if (type && type !== 'all') {
        list = list.filter(d => d.type === type);
      }
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(d =>
          d.name.toLowerCase().includes(s) ||
          d.crop.toLowerCase().includes(s) ||
          d.scientificName?.toLowerCase().includes(s) ||
          d.symptoms.some(sym => sym.toLowerCase().includes(s))
        );
      }
      diseases = list;
    }

    res.json({
      success: true,
      count: diseases.length,
      data: diseases,
      sources: getSources()
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single disease/pest by ID
// @route  GET /api/diseases/:id
export const getDiseaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let disease = null;

    try {
      disease = await Disease.findOne({ $or: [{ id }, { _id: id }] });
    } catch (e) {}

    if (!disease) {
      const all = getDiseases();
      disease = all.find(d => d.id.toLowerCase() === id.toLowerCase());
    }

    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease profile not found.' });
    }

    res.json({
      success: true,
      data: disease
    });
  } catch (err) {
    next(err);
  }
};

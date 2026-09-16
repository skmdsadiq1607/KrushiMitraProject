import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KNOWLEDGE_BASE_DIR = path.resolve(__dirname, '../../../knowledge-base');

let cropsCache = null;
let diseasesCache = null;
let sourcesCache = null;

export const loadKnowledgeBase = () => {
  try {
    const cropsPath = path.join(KNOWLEDGE_BASE_DIR, 'crops', 'crops.json');
    const diseasesPath = path.join(KNOWLEDGE_BASE_DIR, 'diseases', 'diseases.json');
    const pestsPath = path.join(KNOWLEDGE_BASE_DIR, 'pests', 'pests.json');
    const sourcesPath = path.join(KNOWLEDGE_BASE_DIR, 'sources.json');

    if (fs.existsSync(cropsPath)) {
      cropsCache = JSON.parse(fs.readFileSync(cropsPath, 'utf-8'));
    }

    let allDiseases = [];
    if (fs.existsSync(diseasesPath)) {
      allDiseases = JSON.parse(fs.readFileSync(diseasesPath, 'utf-8'));
    }
    if (fs.existsSync(pestsPath)) {
      const pests = JSON.parse(fs.readFileSync(pestsPath, 'utf-8'));
      allDiseases = [...allDiseases, ...pests];
    }
    diseasesCache = allDiseases;

    if (fs.existsSync(sourcesPath)) {
      sourcesCache = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'));
    }

    console.log(`[KnowledgeBase Loaded]: ${cropsCache?.length || 0} crops, ${diseasesCache?.length || 0} diseases/pests, ${sourcesCache?.sources?.length || 0} official sources.`);
  } catch (err) {
    console.error('[KnowledgeBase Error]: Failed to read knowledge base files:', err.message);
  }
};

export const getCrops = () => cropsCache || [];
export const getDiseases = () => diseasesCache || [];
export const getSources = () => sourcesCache?.sources || [];

/**
 * Searches the verified knowledge base for a crop and condition match.
 * Performs intelligent fuzzy & token matching.
 */
export const findVerifiedCondition = (cropName = '', conditionName = '') => {
  const diseases = getDiseases();
  if (!conditionName || !cropName) return null;

  const cropLower = cropName.toLowerCase().trim();
  const condLower = conditionName.toLowerCase().trim();

  // First: try exact or substring crop match
  const cropDiseases = diseases.filter(d => 
    d.crop.toLowerCase().includes(cropLower) || 
    cropLower.includes(d.crop.toLowerCase()) || 
    d.crop.toLowerCase().includes('general')
  );

  if (cropDiseases.length === 0) return null;

  // Check exact name match
  let matched = cropDiseases.find(d => 
    d.name.toLowerCase() === condLower ||
    (d.scientificName && d.scientificName.toLowerCase() === condLower)
  );

  if (matched) return matched;

  // Check partial substring match (e.g. "early blight" in "Early Blight (Alternaria solani)")
  matched = cropDiseases.find(d => 
    condLower.includes(d.name.toLowerCase()) ||
    d.name.toLowerCase().includes(condLower) ||
    (d.scientificName && condLower.includes(d.scientificName.toLowerCase()))
  );

  if (matched) return matched;

  // Check token overlap
  const tokens = condLower.replace(/[^\w\s]/gi, '').split(/\s+/).filter(t => t.length > 3);
  matched = cropDiseases.find(d => {
    const dTokens = (d.name + ' ' + (d.scientificName || '')).toLowerCase();
    return tokens.some(tok => dTokens.includes(tok));
  });

  return matched || null;
};

export const findDiseaseByCropAndKeywords = (cropName, keywords = '') => {
  const diseases = getDiseases();
  const kw = keywords.toLowerCase();
  const crop = cropName.toLowerCase();

  return diseases.filter(d => {
    const matchCrop = d.crop.toLowerCase().includes(crop) || d.crop.toLowerCase().includes('general');
    if (!matchCrop) return false;
    if (!kw) return true;
    return (
      d.name.toLowerCase().includes(kw) ||
      d.symptoms.some(s => s.toLowerCase().includes(kw)) ||
      (d.causes && d.causes.some(c => c.toLowerCase().includes(kw)))
    );
  });
};

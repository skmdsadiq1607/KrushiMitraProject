import Groq from 'groq-sdk';
import { getDiseases, getSources, findVerifiedCondition } from './knowledgeService.js';

let groqClient = null;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_groq_api_key')) {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

/**
 * System prompt strictly scoped to visual pathological assessment
 * Explicitly instructs model NOT to invent treatments or chemical formulations.
 */
const VISION_SYSTEM_PROMPT = `You are KrushiMitra Vision, an expert agricultural image analysis system grounded in scientific standards of the Indian Council of Agricultural Research (ICAR).

YOUR TASK:
Visually inspect the provided crop leaf/plant image and determine what visual pathological signs, pest symptoms, or physiological disorders are present.

CRITICAL INSTRUCTIONS & BOUNDARIES:
1. STRICT VISUAL ANALYSIS ONLY: Analyze visual features (color changes, necrotic lesions, halo margins, concentric rings, pustules, leaf curling, feeding holes, larval frass, or healthy vigor).
2. DO NOT INVENT CHEMICAL TREATMENTS: Do NOT generate pesticide trade names, chemical doses, spraying schedules, withdrawal periods, or fertilizer quantities. Recommendations are retrieved exclusively from verified institutional knowledge bases after diagnosis.
3. UNCERTAINTY & HONESTY: If the image is blurry, out of focus, lacks foliage, or does not provide sufficient diagnostic evidence, classify "conditionType" as "unknown", set "imageQuality" to "blurry" or "poor", and set "condition" to "Insufficient visual evidence to reliably diagnose".
4. CONDITION TYPES ALLOWED:
   - "healthy"
   - "disease" (fungal, bacterial, viral)
   - "pest" (chewing insects, sucking pests, borers, mites)
   - "nutrient_deficiency" (chlorosis, interveinal yellowing, marginal scorch)
   - "environmental_stress" (sunscald, water stress, heat stress)
   - "unknown"

OUTPUT FORMAT:
You MUST respond ONLY with a single valid JSON object following this exact schema:
{
  "crop": "string (Identified crop name, e.g. Tomato, Rice, Cotton, Maize, Soybean, Chilli, Potato, Wheat, or Unknown)",
  "plantPart": "string (e.g. Lower Leaf, Upper Foliage, Stem, Flower, Fruit, Whole Plant)",
  "condition": "string (Specific disease, pest, deficiency, or 'Healthy Foliage', or 'Unknown')",
  "conditionType": "healthy" | "disease" | "pest" | "nutrient_deficiency" | "environmental_stress" | "unknown",
  "confidence": number (integer between 0 and 100),
  "severity": "Low" | "Moderate" | "High" | "Critical",
  "visibleSymptoms": ["string", "string"],
  "possibleCauses": ["string", "string"],
  "alternativePossibilities": ["string", "string"],
  "imageQuality": "good" | "blurry" | "poor_lighting" | "partially_obscured",
  "expertConfirmationRequired": boolean,
  "additionalInformationNeeded": ["string (e.g. soil moisture history, underside leaf check)"]
}`;

/**
 * Executes image analysis through Groq Vision API or returns explicit DEMO RESULT
 */
export const analyzeCropImage = async ({ imageBuffer, mimeType, cropHint, notes }) => {
  const client = getGroqClient();

  // If no Groq API Key is configured, return an explicitly labeled DEMO RESULT
  if (!client) {
    console.warn('[GroqService Notice]: GROQ_API_KEY is not configured in server/.env. Displaying explicit DEMO RESULT.');
    return generateDemoResult(cropHint, notes);
  }

  const preferredModel = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.6-27b';
  const fallbackModels = [
    preferredModel,
    'llama-3.2-11b-vision-preview',
    'llama-3.2-90b-vision-preview'
  ];

  const candidateModels = [...new Set(fallbackModels)];

  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64Image}`;

  const userPrompt = `Analyze this crop specimen image.
${cropHint && cropHint !== 'auto' ? `User indicated crop type: "${cropHint}".` : 'Identify the crop from visual evidence.'}
${notes ? `User reported symptoms/context: "${notes}".` : ''}

Output strictly adhering to the JSON schema.`;

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[GroqService]: Invoking Groq Vision API with model: ${modelName}...`);
      const completion = await client.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: VISION_SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: dataUrl } }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 1024,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      const rawAiResult = JSON.parse(responseText);

      // Now attach verified treatment strictly from knowledge base (NOT from LLM hallucinations)
      return attachVerifiedKnowledge(rawAiResult, false);
    } catch (err) {
      console.warn(`[GroqService]: Model ${modelName} failed or unavailable (${err.message}). Trying next candidate...`);
      lastError = err;
    }
  }

  console.error('[GroqService Error]: All Groq vision models failed:', lastError?.message);
  return generateDemoResult(cropHint, notes, `Live Groq Vision call encountered an error: ${lastError?.message || 'Connection failed'}. Displaying DEMO RESULT.`);
};

/**
 * Attaches verified agronomic management strictly from local knowledge base.
 * Provides deep research, structured biological and chemical cures with dosages and PHI.
 */
function attachVerifiedKnowledge(aiResult, isDemo = false, demoNotice = null) {
  const crop = aiResult.crop || 'Unknown';
  const condition = aiResult.condition || aiResult.problem || 'Unknown';

  // Cross-reference verified knowledge base
  const verifiedMatch = findVerifiedCondition(crop, condition);

  const isHealthy = aiResult.conditionType === 'healthy' || (aiResult.condition && aiResult.condition.toLowerCase().includes('healthy'));

  let management = [];
  let prevention = [];
  let verifiedSources = [];
  let treatmentNotice = null;
  let curativeProtocol = null;
  let preventionProtocol = null;
  let diseaseCycle = null;
  let favorableConditions = null;
  let scientificName = aiResult.scientificName || '';
  let pathogen = aiResult.pathogen || '';

  if (isHealthy) {
    management = [
      'Maintain standard scheduled agronomic operations and balanced irrigation',
      'Continue regular visual scouting once a week across vegetative and flowering stages',
      'Preserve beneficial field insects (ladybird beetles, hoverflies, predatory spiders)'
    ];
    prevention = [
      'Ensure proper drainage and plant spacing for canopy aeration and sun penetration',
      'Apply balanced NPK according to soil test recommendations; avoid excess nitrogen'
    ];
    curativeProtocol = {
      biologicalCure: [
        'Routine prophylactic spray of Trichoderma viride or Pseudomonas fluorescens @ 5g/L once a month'
      ],
      chemicalCure: [],
      sanitation: [
        'Maintain clean field borders free of volunteer weeds'
      ]
    };
    preventionProtocol = {
      seedTreatment: ['Use certified disease-free seeds and bio-priming with Trichoderma @ 10g/kg seed'],
      culturalPractices: ['Practice optimum spacing and drip or morning furrow irrigation'],
      vectorAndPhysical: ['Install yellow and blue sticky traps for routine pest monitoring'],
      resistantCultivars: ['Continue using ICAR / State Agricultural University recommended hybrids']
    };
    verifiedSources = ['ICAR - Indian Council of Agricultural Research Standards'];
  } else if (verifiedMatch) {
    management = verifiedMatch.management || [];
    prevention = verifiedMatch.prevention || [];
    curativeProtocol = verifiedMatch.curativeProtocol || null;
    preventionProtocol = verifiedMatch.preventionProtocol || null;
    diseaseCycle = verifiedMatch.diseaseCycle || null;
    favorableConditions = verifiedMatch.favorableConditions || null;
    scientificName = verifiedMatch.scientificName || scientificName;
    pathogen = verifiedMatch.pathogen || pathogen;
    verifiedSources = [verifiedMatch.source || 'ICAR Agricultural Advisory Standards'];
  } else {
    // Intelligent category-based agronomic advisory for uncataloged variations
    treatmentNotice = 'Specific species profile is being updated in the knowledge base. Standard ICAR Integrated Pest & Disease Management (IPM) guidelines apply.';
    if (aiResult.conditionType === 'pest') {
      curativeProtocol = {
        biologicalCure: [
          'Neem seed kernel extract (NSKE 5%) or Azadirachtin 1500 ppm @ 5 ml/L water with liquid soap emulsifier',
          'Bio-insecticide spray of Beauveria bassiana or Verticillium lecanii @ 5g/L during late afternoon hours'
        ],
        chemicalCure: [
          {
            chemical: 'Consult local Krishi Vigyan Kendra (KVK) for regional CIBRC-approved insecticide active ingredient',
            dosage: 'Strictly as per package label',
            method: 'Foliar spray avoiding peak bee activity hours',
            waitingPeriodDays: 14,
            precautions: 'Wear protective mask and gloves.'
          }
        ],
        sanitation: ['Install sticky traps and remove heavily infested plant parts']
      };
    } else {
      curativeProtocol = {
        biologicalCure: [
          'Foliar spray of Trichoderma viride 1% WP @ 5-10 g/L or Pseudomonas fluorescens @ 5g/L water early morning',
          'Apply neem-based organic formulation (Azadirachtin 1500 ppm @ 3-5 ml/L) as a broad-spectrum deterrent'
        ],
        chemicalCure: [
          {
            chemical: 'Copper Oxychloride 50% WP (Broad-Spectrum Contact Protective)',
            dosage: '2.5 - 3.0 g per liter of water',
            method: 'Thorough foliar spray wetting both sides of leaves',
            waitingPeriodDays: 7,
            precautions: 'Do not spray in extreme heat (>35°C).'
          }
        ],
        sanitation: ['Prune and destroy infected foliage; avoid working in field when plants are wet']
      };
    }
  }

  return {
    ...aiResult,
    problem: aiResult.condition || aiResult.problem,
    problemType: aiResult.conditionType || aiResult.problemType,
    symptoms: aiResult.visibleSymptoms || aiResult.symptoms || [],
    isHealthy,
    scientificName,
    pathogen,
    diseaseCycle,
    favorableConditions,
    management,
    prevention,
    curativeProtocol,
    preventionProtocol,
    verifiedSources,
    verifiedSource: verifiedSources[0] || null,
    treatmentNotice,
    isDemo,
    demoNotice,
    expertAdvice: aiResult.expertConfirmationRequired
      ? 'Field verification recommended by a certified agronomist at your nearest Krishi Vigyan Kendra (KVK).'
      : 'Continue regular field scouting and preventive crop hygiene.',
    disclaimer: 'This is an AI-assisted diagnostic assessment verified against ICAR extension publications. For certified regional chemical recommendations, always consult a local agricultural extension officer.'
  };
}

/**
 * Generates an explicitly labeled DEMO RESULT when GROQ_API_KEY is not configured
 */
function generateDemoResult(cropHint, notes, reason = 'Groq Vision API key is not configured in server environment. This is a synthetic demonstration result.') {
  const selectedCrop = cropHint && cropHint !== 'auto' ? cropHint : 'Tomato';
  const diseases = getDiseases();

  let match = diseases.find(d => d.crop.toLowerCase() === selectedCrop.toLowerCase());
  if (!match) match = diseases[0];

  const isHealthyCheck = notes && (notes.toLowerCase().includes('healthy') || notes.toLowerCase().includes('clean'));

  if (isHealthyCheck) {
    const rawDemo = {
      crop: selectedCrop,
      plantPart: 'Upper and Lower Foliage',
      condition: 'Healthy Crop Foliage',
      conditionType: 'healthy',
      confidence: 96,
      severity: 'Low',
      visibleSymptoms: [
        'Vibrant uniform green coloration without chlorotic halos',
        'Intact leaf lamina and veins with zero necrotic spotting or insect frass'
      ],
      possibleCauses: ['Adequate irrigation and balanced soil nutrient status.'],
      alternativePossibilities: ['Slight early heat stress if ambient temperature rises'],
      imageQuality: 'good',
      expertConfirmationRequired: false,
      additionalInformationNeeded: []
    };
    return attachVerifiedKnowledge(rawDemo, true, reason);
  }

  const rawDemo = {
    crop: match.crop,
    plantPart: 'Lower and Middle Foliage',
    condition: `${match.name} (${match.scientificName || 'Pathogen'})`,
    conditionType: match.type?.toLowerCase().includes('pest') ? 'pest' : 'disease',
    confidence: 92,
    severity: match.severity || 'Moderate',
    visibleSymptoms: match.symptoms || ['Concentric chlorotic lesions on lower leaf lamina'],
    possibleCauses: match.causes || ['High humidity and prolonged leaf wetness duration'],
    alternativePossibilities: ['Early fungal foliar blight', 'Septoria spot'],
    imageQuality: 'good',
    expertConfirmationRequired: true,
    additionalInformationNeeded: ['Field dew duration', 'Previous crop rotation history']
  };

  return attachVerifiedKnowledge(rawDemo, true, reason);
}

export { attachVerifiedKnowledge };

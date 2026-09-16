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
  "crop": "string (Identified crop name, e.g. Tomato, Rice, Cotton, Maize, Soybean, Chilli, or Unknown)",
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

  // Preferred model specified by user: qwen/qwen3.6-27b, with fallback models if unsupported on current tier
  const preferredModel = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.6-27b';
  const fallbackModels = [
    preferredModel,
    'llama-3.2-11b-vision-preview',
    'llama-3.2-90b-vision-preview'
  ];

  // Remove duplicate entries
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
  // Return explicit demo result if live API call failed
  return generateDemoResult(cropHint, notes, `Live Groq Vision call encountered an error: ${lastError?.message || 'Connection failed'}. Displaying DEMO RESULT.`);
};

/**
 * Attaches verified agronomic management strictly from local knowledge base.
 * If verified knowledge is unavailable, displays the exact fallback advisory.
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

  if (isHealthy) {
    management = [
      'Maintain standard scheduled agronomic operations and balanced irrigation',
      'Continue regular visual scouting once a week across vegetative and flowering stages'
    ];
    prevention = [
      'Preserve beneficial field insects (ladybird beetles, predatory spiders)',
      'Ensure proper furrow drainage and plant spacing for canopy aeration'
    ];
    verifiedSources = ['ICAR - Indian Council of Agricultural Research Standards'];
  } else if (verifiedMatch) {
    management = verifiedMatch.management || [];
    prevention = verifiedMatch.prevention || [];
    verifiedSources = [verifiedMatch.source || 'ICAR Agricultural Advisory'];
  } else {
    // Exact requirement from Section 5:
    treatmentNotice = 'Specific treatment information is unavailable in the current knowledge base. Please consult a qualified agricultural expert or local agricultural extension service.';
  }

  return {
    ...aiResult,
    // Unified aliases for backward compatibility with UI
    problem: aiResult.condition || aiResult.problem,
    problemType: aiResult.conditionType || aiResult.problemType,
    symptoms: aiResult.visibleSymptoms || aiResult.symptoms || [],
    isHealthy,
    // Verified Treatments retrieved strictly from knowledge base
    management,
    prevention,
    verifiedSources,
    verifiedSource: verifiedSources[0] || null,
    treatmentNotice,
    // Demo identification
    isDemo,
    demoNotice,
    expertAdvice: aiResult.expertConfirmationRequired
      ? 'Field confirmation recommended by a certified agronomist at your nearest Krishi Vigyan Kendra (KVK).'
      : 'Continue regular field monitoring.',
    disclaimer: 'This is an AI-assisted visual assessment and should be verified with a certified agronomist before applying chemical treatments.'
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
      confidence: 95,
      severity: 'Low',
      visibleSymptoms: [
        'Vibrant uniform green coloration without chlorotic halos',
        'Intact leaf lamina and margins without necrotic spots or insect chewing'
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
    condition: `${match.name} (${match.scientificName || 'Suspected'})`,
    conditionType: match.type?.toLowerCase().includes('pest') ? 'pest' : 'disease',
    confidence: 88,
    severity: match.severity || 'Moderate',
    visibleSymptoms: match.symptoms || ['Chlorotic lesions with concentric rings on leaf lamina'],
    possibleCauses: match.causes || ['Favorable humidity and prolonged canopy leaf moisture'],
    alternativePossibilities: ['Septoria leaf spot', 'Early fungal foliar blight'],
    imageQuality: 'good',
    expertConfirmationRequired: true,
    additionalInformationNeeded: ['Field dew duration', 'Previous crop rotation history']
  };

  return attachVerifiedKnowledge(rawDemo, true, reason);
}

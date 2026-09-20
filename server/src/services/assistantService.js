import Groq from 'groq-sdk';
import { getCrops, getDiseases, getSources, findDiseaseByCropAndKeywords } from './knowledgeService.js';

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

const ASSISTANT_SYSTEM_PROMPT = `You are KrushiMitra AI Assistant, an authoritative agricultural advisor grounded in peer-reviewed publications from the Indian Council of Agricultural Research (ICAR) and State Agricultural Universities (such as TNAU, MPKV, PAU, IIHR, CPRI, IIRR).

YOUR CORE PRINCIPLES:
1. Answer farmer and agronomy queries with deep, actionable, practical scientific rigor.
2. Structure recommendations into four clear, logical sections:
   - 🔍 Diagnostic Symptoms: Key visual signs to verify in the field.
   - 🌿 Biological & Organic Cure: First-line bio-agents (Trichoderma, Pseudomonas, Beauveria, NSKE, neem oil) with formulation and dosage per liter.
   - 🧪 ICAR-Approved Chemical Interventions: CIBRC-registered active ingredients with exact concentrations (e.g. Mancozeb 75% WP @ 2.5g/L), application technique, and Pre-Harvest Interval (PHI waiting period in days). Always mention safety precautions.
   - 🛡️ Prophylactic Prevention: Seed treatment, nursery care, plant spacing, water management, balanced NPK, and resistant cultivars.
3. Always cite official ICAR/SAU standards (e.g. ICAR-IIHR, ICAR-CPRI, ICAR-IIRR, TNAU Agritech).
4. Tone should be respectful, practical, highly informative, and farmer-friendly.`;

export const processAssistantChat = async ({ message, history = [] }) => {
  const client = getGroqClient();

  // If no Groq API Key or offline, utilize knowledge-backed agricultural responder
  if (!client) {
    return generateLocalKnowledgeResponse(message);
  }

  try {
    const crops = getCrops();
    const diseases = getDiseases();
    const sources = getSources();

    // Find if user query references any specific disease or crop
    const relevantDiseases = diseases.filter(d => {
      const q = message.toLowerCase();
      return (
        q.includes(d.crop.toLowerCase()) ||
        q.includes(d.name.toLowerCase()) ||
        (d.scientificName && q.includes(d.scientificName.toLowerCase())) ||
        d.symptoms.some(s => q.includes(s.toLowerCase().slice(0, 15)))
      );
    }).slice(0, 3);

    let specificContext = '';
    if (relevantDiseases.length > 0) {
      specificContext = `\nRELEVANT VERIFIED PROFILES FROM KNOWLEDGE BASE:\n` +
        relevantDiseases.map(d => `
Crop: ${d.crop} | Disease: ${d.name} (${d.scientificName})
Symptoms: ${d.symptoms?.slice(0, 3).join('; ')}
Biological Cure: ${d.curativeProtocol?.biologicalCure?.join('; ') || 'Trichoderma / Pseudomonas bio-spray'}
Chemical Cure: ${d.curativeProtocol?.chemicalCure?.map(c => `${c.chemical} @ ${c.dosage} (PHI: ${c.waitingPeriodDays || 7} days)`).join('; ') || d.management?.join('; ')}
Prevention: ${d.preventionProtocol?.seedTreatment?.join('; ') || d.prevention?.join('; ')}
Source: ${d.source}
`).join('\n');
    }

    const kbContext = `
VERIFIED AGRICULTURAL REPOSITORY CONTEXT:
Available Crops in Knowledge Base: ${crops.map(c => c.name).join(', ')}.
Total Verified Disease & Pest Profiles: ${diseases.length}.
Key Research Standards: ${sources.map(s => s.name).join('; ')}.
${specificContext}
`;

    const messages = [
      { role: 'system', content: ASSISTANT_SYSTEM_PROMPT + '\n\n' + kbContext }
    ];

    // Append recent history (up to last 6 messages)
    if (Array.isArray(history)) {
      const recent = history.slice(-6);
      for (const h of recent) {
        if (h.sender === 'user') {
          messages.push({ role: 'user', content: h.text });
        } else if (h.sender === 'bot') {
          messages.push({ role: 'assistant', content: h.text });
        }
      }
    }

    messages.push({ role: 'user', content: message });

    const candidateChatModels = [
      process.env.GROQ_CHAT_MODEL || 'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'llama-3.3-70b-versatile'
    ];

    let completion = null;
    let lastErr = null;

    for (const modelId of candidateChatModels) {
      try {
        completion = await client.chat.completions.create({
          model: modelId,
          messages,
          temperature: 0.3,
          max_tokens: 1000
        });
        if (completion) break;
      } catch (mErr) {
        lastErr = mErr;
      }
    }

    if (!completion) {
      throw lastErr || new Error('No Groq chat model available');
    }

    const reply = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this moment.';

    return {
      reply,
      sources: relevantDiseases.length > 0
        ? relevantDiseases.map(d => d.source || 'ICAR Agricultural Advisory')
        : ['ICAR National Agricultural Standards', 'TNAU Agritech Portal'],
      isDemo: false
    };
  } catch (err) {
    console.warn('[AssistantService Fallback]: Groq API call failed, using offline agricultural knowledge engine:', err.message);
    return generateLocalKnowledgeResponse(message);
  }
};

/**
 * Intelligent local knowledge responder when Groq API key is inactive
 */
function generateLocalKnowledgeResponse(message) {
  const q = message.toLowerCase();
  const diseases = getDiseases();

  // Search for matching disease
  const match = diseases.find(d =>
    q.includes(d.name.toLowerCase()) ||
    q.includes(d.crop.toLowerCase()) ||
    (d.scientificName && q.includes(d.scientificName.toLowerCase()))
  );

  if (match) {
    const bioText = match.curativeProtocol?.biologicalCure?.length > 0
      ? match.curativeProtocol.biologicalCure.map((b, i) => `  ${i + 1}. ${b}`).join('\n')
      : match.management?.slice(0, 2).map((m, i) => `  ${i + 1}. ${m}`).join('\n') || '  1. Spray Trichoderma viride @ 5-10 g/L water.';

    const chemText = match.curativeProtocol?.chemicalCure?.length > 0
      ? match.curativeProtocol.chemicalCure.map(c => `  • ${c.chemical}: Dosage ${c.dosage} (Pre-Harvest Interval: ${c.waitingPeriodDays || 7} days waiting period)`).join('\n')
      : '  • Consult your local KVK officer for approved chemical active ingredients.';

    const prevText = match.preventionProtocol?.seedTreatment?.length > 0
      ? match.preventionProtocol.seedTreatment.concat(match.preventionProtocol.culturalPractices || []).slice(0, 3).map((p, i) => `  ${i + 1}. ${p}`).join('\n')
      : match.prevention?.slice(0, 3).map((p, i) => `  ${i + 1}. ${p}`).join('\n') || '  1. Practice 2-3 year crop rotation with non-host crops.';

    const reply = `### ICAR Advisory for ${match.name} on ${match.crop}

**Scientific Pathogen:** *${match.scientificName || match.pathogen || 'Foliar Pathogen'}*

#### 🌿 1. Biological & Organic Cure
${bioText}

#### 🧪 2. ICAR-Approved Chemical Remedies
${chemText}

#### 🛡️ 3. Prevention & Seed Care
${prevText}

*Source: ${match.source || 'ICAR Agricultural Advisory Standards'}*`;

    return {
      reply,
      sources: [match.source || 'ICAR Agricultural Research Standards'],
      isDemo: true
    };
  }

  // General helpful agritech guidance
  return {
    reply: `Hello! I am your KrushiMitra AI Agricultural Advisor, grounded in ICAR research standards.

I can provide comprehensive scientific guidance, biological cures, chemical dosages with Pre-Harvest Intervals (PHI), and prevention protocols for:
• **Crops:** Tomato, Potato, Rice/Paddy, Cotton, Chilli, Wheat, Maize, Soybean, and Groundnut.
• **Pathologies:** Blights, Rusts, Mildews, Leaf Curls, Wilts, Bollworms, Stem Borers, and Nutrient Deficiencies.

Please mention your crop and symptoms (e.g. *"How do I treat Late Blight in potato organically and chemically?"*).`,
    sources: ['ICAR National Agricultural Standards'],
    isDemo: true
  };
}

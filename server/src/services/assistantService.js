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

const ASSISTANT_SYSTEM_PROMPT = `You are KrushiMitra AI Assistant, an agricultural advisor grounded in scientific publications from the Indian Council of Agricultural Research (ICAR) and State Agricultural Universities (such as TNAU, MPKV, PAU).

YOUR RESPONSIBILITIES & BOUNDARIES:
1. Answer farmer and agronomy queries clearly, concisely, and supportively.
2. Structure advice into:
   - Symptoms to verify
   - Cultural & agronomic practices (spacing, drainage, sanitation)
   - Biological management (Trichoderma, Pseudomonas, Neem extracts)
   - Chemical interventions: State safety precautions clearly; DO NOT fabricate unverified chemical dosages or random commercial trade names. Always state: "Chemical application should strictly adhere to the Central Insecticides Board & Registration Committee (CIBRC) approved labels and local KVK advisory."
3. If the user asks about Rice, Cotton, Soybean, Maize, Tomato, or Chilli, reference specific verified IPM practices.
4. When relevant, cite the knowledge source (e.g. "Source: ICAR-IIHR Tomato Disease Advisory" or "Source: TNAU Agritech Portal").
5. Keep tone respectful, practical, and farmer-friendly.`;

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

    const kbContext = `
VERIFIED AGRICULTURAL KNOWLEDGE CONTEXT:
Available Crops in Knowledge Base: ${crops.map(c => c.name).join(', ')}.
Notable Diseases & Pests Covered: ${diseases.slice(0, 10).map(d => `${d.name} (${d.crop})`).join(', ')}.
Key Research Sources: ${sources.map(s => s.name).join('; ')}.
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
          max_tokens: 800
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
      sources: ['ICAR National Agricultural Standards', 'TNAU Agritech Portal'],
      isAiGenerated: true
    };
  } catch (error) {
    console.error('[AssistantService Error]:', error.message);
    return generateLocalKnowledgeResponse(message);
  }
};

/**
 * Intelligent local responder using verified knowledge base for offline demos
 */
function generateLocalKnowledgeResponse(userMessage) {
  const q = userMessage.toLowerCase();
  const diseases = getDiseases();
  const crops = getCrops();

  // Check if a specific disease or crop is mentioned
  const matchedCrop = crops.find(c => q.includes(c.name.toLowerCase()));
  const matchedDisease = diseases.find(d => q.includes(d.name.toLowerCase()) || (matchedCrop && d.crop.toLowerCase() === matchedCrop.name.toLowerCase()));

  if (matchedDisease) {
    return {
      reply: `### Assessment regarding **${matchedDisease.name}** in **${matchedDisease.crop}**

**1. Key Symptoms to Check:**
${matchedDisease.symptoms.map(s => `- ${s}`).join('\n')}

**2. Favorable Environmental Conditions:**
- Temperature: ${matchedDisease.favorableConditions?.temperature || 'Moderate'}
- Humidity: ${matchedDisease.favorableConditions?.humidity || 'High humidity'}
- Weather Trigger: ${matchedDisease.favorableConditions?.weatherFactor || 'Prolonged leaf moisture'}

**3. Recommended Cultural & Biological Management:**
${matchedDisease.management.map(m => `- ${m}`).join('\n')}

**4. Long-Term Prevention:**
${matchedDisease.prevention.map(p => `- ${p}`).join('\n')}

> **Important Agricultural Disclaimer:**
> Specific chemical formulations should be chosen in consultation with your local Krishi Vigyan Kendra (KVK) or block agriculture extension officer to prevent chemical resistance.`,
      sources: [matchedDisease.source || 'ICAR Agricultural Advisory'],
      isAiGenerated: false
    };
  }

  if (q.includes('yellow') || q.includes('chlorosis')) {
    return {
      reply: `### Diagnostic Guidance for **Yellowing Leaves (Chlorosis)**

When crop foliage turns yellow, evaluate where the yellowing begins:
1. **Lower, Older Leaves First (Mobile Nutrients):**
   - **Nitrogen (N) Deficiency:** Uniform pale green to yellowing starting from the tip down the midrib (classic V-shape in maize).
   - **Potassium (K) Deficiency:** Yellowing and scorching along the outer leaf margins.
   - **Remedy:** Apply 1-2% urea foliar spray or top-dress balanced NPK according to soil test values.

2. **Upper, Younger Leaves First (Immobile Nutrients):**
   - **Iron (Fe) or Zinc (Zn) Deficiency:** Interveinal chlorosis where veins remain green while leaf lamina turns yellow or white.
   - **Remedy:** Foliar spray of chelated micronutrients (Fe-EDTA or Zinc Sulphate @ 0.5%).

3. **Curled or Puckered Leaves with Yellowing:**
   - Often viral infection (such as Yellow Mosaic Virus or Leaf Curl Virus) transmitted by whiteflies or thrips.

*Consult your nearest Krishi Vigyan Kendra (KVK) with a leaf sample for precise microscopic or chemical confirmation.*`,
      sources: ['ICAR-Indian Institute of Soil Science (IISS)', 'TNAU Agritech Nutrient Guide'],
      isAiGenerated: false
    };
  }

  // General helpful response
  return {
    reply: `Hello! I am your **Crop Health AI Assistant**. I can help you with:

- **Disease Identification & Management:** Insights on Early/Late Blight, Rice Blast, Sheath Blight, Cotton Bacterial Blight, Soybean Rust, etc.
- **Pest Monitoring & IPM:** Control strategies for Fall Armyworm, Bollworm, Thrips, and Whitefly.
- **Deficiency Symptoms:** Identifying Nitrogen, Potassium, and micronutrient shortages.
- **Weather Advisory:** Assessing disease risks associated with high humidity or excess rainfall.

*Please mention your specific crop name (e.g. Tomato, Rice, Cotton, Soybean, Maize, Chilli) and the symptoms you are observing.*`,
    sources: ['ICAR National Agricultural Standards'],
    isAiGenerated: false
  };
}

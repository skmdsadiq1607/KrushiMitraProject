# AI Vision Analysis & Guardrails Architecture

## 1. Primary Image Analysis Engine: Groq Vision

The application uses the **Groq API** as the primary image analysis engine with image + text multimodal input and JSON output.

### Model Preference:
- **Default/Preferred Model**: `qwen/qwen3.6-27b` (configurable via `process.env.GROQ_VISION_MODEL`).
- **Resilient Fallbacks**: If `qwen/qwen3.6-27b` is not provisioned on a specific Groq tier, the service automatically falls back to `llama-3.2-11b-vision-preview` or `llama-3.2-90b-vision-preview`.

### The End-to-End Diagnostic Flow:
```
User uploads crop/leaf image
       ↓
React frontend (Vite + TS)
       ↓
Express backend (/api/diagnosis/analyze)
       ↓
Groq Vision (qwen/qwen3.6-27b)
       ↓
Structured JSON diagnosis (Visual Evidence Only)
       ↓
Knowledge-base lookup (ICAR / Agricultural Universities)
       ↓
Final result (Structured findings + verified treatments)
```

---

## 2. Structured Output Schema from Groq Vision

Groq is instructed strictly to perform visual pathological inspection and output the following JSON schema:

```json
{
  "crop": "Tomato",
  "plantPart": "Lower Foliage",
  "condition": "Early Blight (Alternaria solani)",
  "conditionType": "disease",
  "confidence": 88,
  "severity": "Moderate",
  "visibleSymptoms": [
    "Dark brown to black necrotic spots with concentric target rings",
    "Yellow halos surrounding lesions"
  ],
  "possibleCauses": [
    "Alternaria solani fungal spores splash-dispersed from damp soil",
    "Prolonged leaf wetness and high canopy humidity"
  ],
  "alternativePossibilities": [
    "Septoria leaf spot",
    "Early fungal foliar blight"
  ],
  "imageQuality": "good",
  "expertConfirmationRequired": true,
  "additionalInformationNeeded": [
    "Check underside of leaves for white mold",
    "Recent overhead irrigation history"
  ]
}
```

### Supported `conditionType` Categories:
- `healthy`
- `disease` (fungal, bacterial, viral)
- `pest` (borers, sucking pests, caterpillars)
- `nutrient_deficiency` (chlorosis, marginal necrosis, stunting)
- `environmental_stress` (heat stress, waterlogging, sunscald)
- `unknown` (when the image is blurry, ambiguous, or lacks plant tissue)

---

## 3. Strict Agricultural Safety: Decoupling AI from Treatments

**Groq is NOT permitted to invent chemical treatments, pesticide dosages, spraying intervals, or commercial trade names.**

Treatment retrieval follows a strict verified pipeline:
1. Groq identifies the `crop` and `condition`.
2. The Express backend queries `knowledge-base/` using `findVerifiedCondition(crop, condition)`.
3. If verified entry exists, treatments are populated exclusively from verified ICAR, TNAU, ICAR-IIHR, ICAR-CICR, or ICAR-IIRR advisories.
4. If verified entry does NOT exist, the system explicitly displays:
   > *"Specific treatment information is unavailable in the current knowledge base. Please consult a qualified agricultural expert or local agricultural extension service."*

---

## 4. Truth in Evaluation: Explicit DEMO RESULT

If `GROQ_API_KEY` is not configured in `.env`:
- The application does NOT pretend that an AI vision model ran.
- The result is prominently marked with a distinct amber badge: **`DEMO RESULT`**.
- An explicit notice explains:
  > *"Groq Vision API key is not configured in server environment. This is a synthetic demonstration result, not a live AI prediction."*

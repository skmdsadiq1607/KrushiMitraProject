# System Architecture & Technical Flow

## 1. High-Level Architecture Overview

**Crop Health AI** is structured as a decoupled Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered for rapid agricultural image assessment, risk alerting, and agronomic knowledge retrieval.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                            │
│  React.js (v18) + Vite + TypeScript + Tailwind CSS          │
│  - Lucide React Iconography                                 │
│  - Recharts Diagnostic Visualizations                       │
│  - Leaflet / React Leaflet Geospatial Community Outbreak Map│
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON & Multipart
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION TIER                        │
│  Node.js + Express.js REST API Server                       │
│  ├── Security: Helmet, CORS, JWT Verification               │
│  ├── Uploads: In-Memory Multer Stream Buffer                │
│  ├── Agrometeorology Engine: Open-Meteo Integration        │
│  └── Verified Knowledge Store: ICAR / TNAU Grounding Engine │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│       EXTERNAL AI TIER       │ │        PERSISTENCE TIER     │
│  Groq Cloud Vision API       │ │  MongoDB Atlas / Mongoose   │
│  - llama-3.2-11b-vision-prev │ │  - Users & JWT Auth         │
│  - llama-3.3-70b-versatile   │ │  - Diagnosis History & Logs │
│  - Strict JSON Enforcement   │ │  - Field Outbreak Reports   │
│  - Low Latency (<1.2s)       │ │  - Verified Knowledge Base  │
└──────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. AI Vision Diagnostic Flow

When an agricultural user captures or uploads a crop leaf photograph, the system executes an end-to-end multi-tier pipeline:

1. **Client Ingestion**: The user uploads an image (JPG, PNG, WEBP) in `Diagnose.tsx`. A client-side format and file-size validation (< 10MB) ensures bandwidth efficiency.
2. **Streaming to Express**: The image is streamed as multipart form-data to `/api/diagnosis/analyze`. The server holds the binary buffer in RAM using Multer memory storage without saving unmanaged files on disk.
3. **Groq Vision Invocation**:
   - The buffer is encoded to standard RFC 2397 base64 data URL.
   - A structured diagnostic system instruction enforces strict JSON output.
   - The model distinguishes between healthy foliage, fungal/bacterial diseases, pest markings, nutrient deficiencies, or insufficient evidence.
4. **Knowledge-Base Cross-Verification**: The backend inspects local ICAR/TNAU advisories matching the identified crop and disease to ensure cultural practices and integrated pest management (IPM) guidelines align with verified Indian agricultural research standards.
5. **Persistence & Return**: The structured result is returned to the user interface, rendering a confidence gauge, severity indicator, symptoms checklist, causes, management steps, and mandatory disclaimers.

---

## 3. Weather Risk Engine Architecture

Pathogen germination and epidemic outbreaks are heavily triggered by environmental micro-climates:
- **Fungal Blights (Early Blight, Rice Blast, Rust)**: Triggered when relative humidity exceeds 80% and temperature sits between 20°C - 30°C with prolonged dew wetness.
- **Late Blight (Phytophthora infestans)**: Triggered during cool, humid spells (15°C - 22°C with > 85% humidity).
- **Sucking Pests (Thrips, Whiteflies)**: Triggered by prolonged dry heat (> 35°C), which accelerates insect generation cycles.
- **Waterlogging & Damping-Off**: Triggered by active precipitation exceeding 15mm.

The backend leverages **Open-Meteo's** meteorological API without exposing external keys to the frontend, computing an indicative Crop Health Risk Index for any latitude and longitude.

---

## 4. Geospatial Mapping Engine

The community outbreak map leverages **Leaflet.js** and **OpenStreetMap**:
- Avoids proprietary paid map keys.
- Renders color-coded severity markers (Critical, High, Moderate, Low).
- Integrates browser Geolocation API to auto-center on the user's field.

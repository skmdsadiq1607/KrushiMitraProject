# 🌾 KrushiMitra — AI-Powered Crop Health & Diagnostic Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-10b981.svg)](https://github.com)
[![Groq Vision AI](https://img.shields.io/badge/AI-Groq%20Vision-orange.svg)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Academic Project](https://img.shields.io/badge/Level-College%20B.Tech%20Project-purple.svg)]()

> **KrushiMitra** is an AI-powered crop disease, pest, and agronomic risk analysis platform integrating Groq Vision AI, Leaflet geospatial mapping, real-time agrometeorology, and verified ICAR agricultural research standards.

---

## 1. Problem Statement

Plant diseases and insect pests contribute to an estimated **20% to 35% annual yield loss** in Indian agriculture. Smallholder farmers typically identify pathological disorders through guesswork or delay action until visible defoliation occurs. Injudicious spraying of synthetic chemicals increases costs, damages agro-ecosystems, and causes pathogen resistance.

## 2. Solution

**KrushiMitra** is a production-quality full-stack web application designed for farmers, agronomists, and researchers. By capturing a photograph of an affected leaf, the platform provides:
- **Instant Vision Diagnosis**: Powered by Groq's high-speed multimodal vision models.
- **ICAR-Grounded Management**: Recommendations aligned with official research institutes (ICAR, TNAU, IIHR, CICR).
- **Meteorological Disease Forecasting**: Dynamic risk index tracking fungal blast, late blight, and heat stress triggers based on Open-Meteo live feeds.
- **Community Geospatial Mapping**: Outbreak surveillance map with GPS coordinates on OpenStreetMap.
- **Conversational Agri-Assistant**: Chatbot providing answers on IPM, nutrient deficiencies, and cultural practices.

---

## 3. Key Features

- **AI Vision Diagnostic Studio (`/diagnose`)**: Drag-and-drop or 1-click test specimen loader, scanning animation, radial confidence gauge, severity badges, and print-ready reports.
- **Diagnostic Telemetry History (`/history`)**: Searchable and filterable archive with modal inspection and deletion.
- **Disease & Pest Encyclopedia (`/disease-library`)**: Detailed symptom, favorable weather, and bio-control profiles across Rice, Cotton, Soybean, Maize, Tomato, and Chilli.
- **Agro-Weather Risk Matrix (`/weather-risk`)**: Live temperature, humidity, wind, rainfall, 5-day outlook, and calculated fungal/bacterial threat levels.
- **Geospatial Outbreak Surveillance (`/field-reports`)**: Interactive Leaflet map with colored severity markers and field report submission.
- **KrushiMitra Conversational Assistant (`/assistant`)**: Natural language question-answering grounded in agricultural extension standards.
- **Comprehensive User Dashboard (`/dashboard`)**: Summary metrics, Recharts problem share distribution, monthly activity, and quick actions.
- **Dark & Light Mode**: Accessible UI with persistent theme toggle and contrast-safe severity badges.

---

## 4. Architecture

```
React + Vite Frontend (Port 3000)
       │
       ▼ (REST API / JSON & Multipart)
Express.js + Node.js Backend (Port 5000)
       │
       ├── Groq AI Cloud (llama-3.2-11b-vision-preview / llama-3.3-70b-versatile)
       ├── Open-Meteo Meteorology (Global Live Weather & Crop Risk Index)
       ├── ICAR / TNAU Local Knowledge Base (knowledge-base/)
       └── MongoDB Atlas / Local Database (Users, Diagnoses, Reports, Crops)
```

---

## 5. Technology Stack

### Frontend
- **Framework**: React 18, Vite (Pure JavaScript / JSX)
- **Styling**: Tailwind CSS with custom agriculture palette
- **Routing**: React Router DOM (v6)
- **Visualizations**: Recharts (Pie & Bar charts)
- **Maps**: Leaflet & React-Leaflet with OpenStreetMap tiles
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (ES Modules) & Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **File Uploads**: Multer in-memory storage (clean RAM processing)
- **AI Vision**: Groq SDK (`groq-sdk`)

---

## 6. Project Structure

```
KrushiMitraProject/
├── client/                     # Pure JavaScript (React + Vite + JSX) Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, SeverityBadge, Animation, ResultCard
│   │   ├── context/            # AuthContext (JWT) & ThemeContext (Dark/Light)
│   │   ├── pages/              # LandingPage, Dashboard, Diagnose, History, etc.
│   │   └── services/           # Axios API Client
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express REST API Backend
│   ├── src/
│   │   ├── config/             # Database connection with graceful offline fallback
│   │   ├── controllers/        # Auth, Diagnosis, Crops, Diseases, Reports, Weather
│   │   ├── middleware/         # JWT Protection & Centralized Error Handler
│   │   ├── models/             # Mongoose Schemas (User, Diagnosis, Crop, Disease, Report)
│   │   ├── routes/             # Express API Endpoints
│   │   ├── services/           # Groq Vision, Weather Risk Engine, Knowledge Base
│   │   └── server.js           # Server Entrypoint
│   └── package.json
├── knowledge-base/             # Curated Agricultural Data
│   ├── crops/crops.json        # 6 major crop profiles
│   ├── diseases/diseases.json  # Comprehensive disease profiles
│   ├── pests/pests.json        # Specialized insect pest profiles
│   └── sources.json            # Official ICAR / SAU Research Citations
├── data/demo/                  # Sample test specimens and outbreak reports
├── scripts/seedDatabase.js     # Database seeding script
└── docs/                       # Project report, architecture, API reference, schemas
```

---

## 7. Environment Variables

Create `.env` in `server/` (a template is provided in `server/.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crop_health_ai
JWT_SECRET=crop_health_ai_college_jwt_secret_key_2025
GROQ_API_KEY=your_groq_api_key_here
WEATHER_API_KEY=
```

> **Note on Free Keys**:
> - **Groq API Key**: Obtain a free key at [console.groq.com](https://console.groq.com/keys). *(If not set, the app seamlessly runs on the local verified knowledge simulation engine so your demo never crashes!)*
> - **Weather**: Uses Open-Meteo by default, which works globally with **zero keys required**.
> - **MongoDB**: Supports MongoDB Atlas connection string or local MongoDB. If offline, the built-in resilient in-memory data layer activates automatically.

---

## 8. Installation & Quick Start

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 3: Run the Application
In terminal 1 (Backend):
```bash
cd server
npm start
```
*Server starts on `http://localhost:5000`*

In terminal 2 (Frontend):
```bash
cd client
npm run dev
```
*Vite dev server starts on `http://localhost:3000`*

---

## 9. College Demonstration Workflow

To demonstrate the application during an evaluation:

1. **Landing Page (`/`)**: Walk through the "Understand Your Crop Health with AI" hero, workflow diagram, and features.
2. **1-Click Demo Login (`/login`)**: Click the **"Demo Login"** button on the sign-in page to instantly enter as a verified farmer (`farmer@krushimitra.org`).
3. **Dashboard (`/dashboard`)**: Show real-time statistics, problem share charts, monthly activity, and the live Open-Meteo weather alert.
4. **Crop Diagnosis Studio (`/diagnose`)**:
   - Click one of the **"Quick Test: Load Pre-configured Specimen"** buttons (e.g. *Tomato Early Blight* or *Rice Blast*).
   - Click **"Initiate AI Vision Diagnosis"**.
   - Observe the multi-stage scanning animation.
   - Review the radial confidence score (e.g. 89%), severity badge, observed symptoms, ICAR-backed management steps, and disclaimer.
   - Click **"Save Diagnosis"** or **"Print / PDF"**.
5. **History (`/history`)**: Verify the saved diagnostic report in the table, inspect details in the modal, and test search/filter.
6. **Agro-Weather Risk Matrix (`/weather-risk`)**: Click **"Use My GPS Location"** to compute live humidity, rainfall, and fungal risk for your current coordinates.
7. **Disease Library (`/disease-library`)**: Search for "Blight" or filter by "Rice", showing the verified ICAR-IIHR citations.
8. **Community Outbreak Map (`/field-reports`)**: Explore pins across India on OpenStreetMap and submit a new report.
9. **Agri-Advisor Chat (`/assistant`)**: Click a suggested prompt like *"What should I check if my crop leaves are turning yellow?"* to demonstrate grounded responses.

---

## 10. Agricultural Safety & Disclaimers

This software is an educational decision-support tool. In accordance with agricultural safety guidelines:
- Chemical pesticides and dosages must strictly adhere to the Central Insecticides Board & Registration Committee (CIBRC) approved label directions.
- Always consult a local Krishi Vigyan Kendra (KVK) or block agricultural extension officer before chemical field applications.

---

## 11. Academic Project Information

- **Project Title**: Crop Health AI
- **Course**: B.Tech Final Year / Semester Capstone Project
- **Specialization**: Artificial Intelligence & Full-Stack Web Development

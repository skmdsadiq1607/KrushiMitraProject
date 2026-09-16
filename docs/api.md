# REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "name": "Ramesh Patel",
    "email": "farmer@example.com",
    "password": "secretpassword",
    "role": "farmer",
    "farmLocation": { "state": "Maharashtra", "district": "Pune" }
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": "673b...",
      "name": "Ramesh Patel",
      "email": "farmer@example.com",
      "role": "farmer"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates existing credentials. (Supports 1-click demo login via `farmer@krushimitra.org`).
- **Request Body**:
  ```json
  { "email": "farmer@krushimitra.org", "password": "farmerpassword123" }
  ```

### `GET /api/auth/me`
Retrieves current authenticated profile.
- **Header**: `Authorization: Bearer <token>`

---

## 2. Diagnosis Endpoints (`/api/diagnosis`)

### `POST /api/diagnosis/analyze`
Submits an image for Groq Vision AI analysis.
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `image`: File (JPG, PNG, WEBP max 10MB)
  - `crop`: String (Optional crop hint, e.g. "Tomato", "Rice", "Cotton")
  - `notes`: String (Optional symptom observations)
  - `save`: Boolean (`true` to auto-persist to history)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "crop": "Tomato",
      "plantPart": "Lower Foliage",
      "problem": "Early Blight (Alternaria solani)",
      "confidence": 89,
      "severity": "Moderate",
      "isHealthy": false,
      "symptoms": [
        "Dark brown circular target spots with concentric rings",
        "Yellow chlorotic halo around lesions"
      ],
      "possibleCauses": [
        "Alternaria solani fungal spores splash-dispersed from damp soil",
        "High canopy humidity and prolonged leaf wetness"
      ],
      "management": [
        "Prune and destroy infected lower foliage immediately",
        "Apply protective copper oxychloride or bio-agent Trichoderma viride"
      ],
      "prevention": [
        "Practice 2-3 year crop rotation with non-solanaceous crops",
        "Ensure adequate plant spacing to facilitate leaf drying"
      ],
      "expertAdvice": "Monitor upper canopy. If lesions spread, consult your local KVK.",
      "disclaimer": "Informational assessment based on image analysis. Always verify before chemical application.",
      "verifiedSource": "ICAR-IIHR Tomato Disease Advisory"
    }
  }
  ```

### `GET /api/diagnosis/history`
Fetches past diagnosis history.
- **Query Parameters**:
  - `crop`: Filter by crop name
  - `severity`: Filter by severity ('Low', 'Moderate', 'High', 'Critical')
  - `search`: Search query string

### `DELETE /api/diagnosis/:id`
Deletes a specific diagnosis record.

---

## 3. Knowledge Base Endpoints

### `GET /api/crops`
Lists all verified crops and their agronomic profiles.

### `GET /api/diseases`
Lists all verified diseases, pests, and deficiencies.
- **Query Parameters**: `crop`, `type`, `search`

---

## 4. Agrometeorology Endpoints (`/api/weather`)

### `GET /api/weather`
Retrieves live weather telemetry and disease risk assessment.
- **Query Parameters**:
  - `lat`: Latitude (default: 18.5204)
  - `lng`: Longitude (default: 73.8567)
  - `location`: Location name label

---

## 5. Field Reports Endpoints (`/api/reports`)

### `GET /api/reports`
Retrieves community-submitted outbreak reports for Leaflet map display.

### `POST /api/reports`
Submits a new field report.
- **Request Body**:
  ```json
  {
    "reporterName": "Suresh Reddy",
    "crop": "Cotton",
    "issue": "Pink Bollworm Larval Flaring",
    "severity": "High",
    "description": "Noticed flared bracts on young squares across 2 acres.",
    "location": { "region": "Wardha, Maharashtra", "lat": 20.74, "lng": 78.60 }
  }
  ```

---

## 6. AI Assistant Endpoints (`/api/assistant`)

### `POST /api/assistant/chat`
Conversational chat with Groq Llama 3.3 grounded in ICAR research.
- **Request Body**:
  ```json
  {
    "message": "What are common symptoms of tomato early blight?",
    "history": []
  }
  ```

# Database Schema & Model Definitions

**Crop Health AI** utilizes MongoDB with Mongoose ODM for data modeling, indexing, and validation.

---

## 1. User Schema (`User.js`)

Stores user account credentials, agronomic roles, and regional farm coordinates.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required, Trim, Max: 50 | Full name of the user |
| `email` | String | Required, Unique, Lowercase, Regex | User email used for authentication |
| `password` | String | Required, Min: 6, Select: false | Bcrypt hashed password (salt rounds: 10) |
| `role` | String | Enum: ['farmer', 'agronomist', 'student', 'researcher'] | User classification |
| `farmLocation` | Object | `{ state: String, district: String }` | Primary agricultural region |
| `primaryCrops` | [String] | Array of crop names | Crops cultivated or monitored |
| `createdAt` | Date | Default: Date.now | Account registration timestamp |

---

## 2. Diagnosis Schema (`Diagnosis.js`)

Maintains record of all AI vision analyses executed by farmers and field officers.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `userId` | ObjectId | Ref: 'User', Optional | User who submitted the diagnostic scan |
| `crop` | String | Required, Trim | Name of the crop analyzed |
| `plantPart` | String | Default: 'Leaf / Foliage' | Plant morphological part analyzed |
| `problem` | String | Required | Disease, pest, deficiency, or 'Healthy' |
| `confidence` | Number | Required, Min: 0, Max: 100 | Statistical model confidence score (%) |
| `severity` | String | Enum: ['Low', 'Moderate', 'High', 'Critical'] | Urgency classification |
| `isHealthy` | Boolean | Default: false | Flag for asymptomatic specimens |
| `symptoms` | [String] | Array | Bulleted list of detected foliar symptoms |
| `possibleCauses` | [String] | Array | Environmental and biological causes |
| `management` | [String] | Array | ICAR-verified IPM management steps |
| `prevention` | [String] | Array | Cultural and prophylactic measures |
| `expertAdvice` | String | Advisory text | Extension advisory and KVK guidance |
| `disclaimer` | String | Warning notice | Legal & agricultural safety disclaimer |
| `imageUrl` | String | Data URL or URL | Thumbnail preview of analyzed specimen |
| `userNotes` | String | Optional context | Notes provided by user during scan |
| `createdAt` | Date | Default: Date.now, Indexed | Submission timestamp |

**Indexes**: `{ userId: 1, createdAt: -1 }` for rapid history pagination.

---

## 3. Crop Schema (`Crop.js`)

Knowledge-base catalog for supported agricultural crops.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (Unique) | Slug identifier (e.g. `rice`, `tomato`, `cotton`) |
| `name` | String | Common crop name |
| `scientificName` | String | Botanical binomial name |
| `category` | String | Cereal, Cash, Oilseed, Vegetable |
| `season` | String | Kharif, Rabi, Zaid, Year-round |
| `growthStages` | [String] | Chronological development phases |
| `optimalConditions`| Object | `{ temperature, humidity, soil, rainfall }` |
| `vulnerabilities` | [String] | Common diseases and pests |
| `source` | String | Official research institute citation |

---

## 4. Disease Schema (`Disease.js`)

Detailed profiles of pathogens, pests, and abiotic disorders.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (Unique) | Unique identifier (e.g. `tomato-early-blight`) |
| `name` | String | Disease or pest common name |
| `scientificName` | String | Pathogen or pest scientific name |
| `crop` | String | Associated host crop |
| `type` | String | Enum: ['Disease', 'Pest', 'Nutrient deficiency', 'Environmental stress'] |
| `severity` | String | Default severity grading |
| `symptoms` | [String] | Diagnostic visual signs |
| `favorableConditions`| Object | Temperature, humidity, and weather triggers |
| `management` | [String] | Cultural, biological, and agronomic management |
| `prevention` | [String] | Preventative practices |
| `source` | String | Citing ICAR-IIHR, CICR, IIRR, or TNAU |

---

## 5. Field Report Schema (`FieldReport.js`)

Community-submitted crop health observations mapped on Leaflet.

| Field | Type | Description |
| :--- | :--- | :--- |
| `reporterName` | String | Name of the observer |
| `crop` | String | Crop affected |
| `issue` | String | Title of observed outbreak |
| `severity` | String | ['Low', 'Moderate', 'High', 'Critical'] |
| `description` | String | Field description and notes |
| `location` | Object | `{ region: String, lat: Number, lng: Number }` |
| `status` | String | ['Reported', 'Under Review', 'Verified', 'Action Required', 'Resolved'] |
| `isDemo` | Boolean | Distinguishes synthetic demo data from real logs |
| `date` | Date | Incident log timestamp |

**Indexes**: `{ 'location.lat': 1, 'location.lng': 1 }` for spatial querying.

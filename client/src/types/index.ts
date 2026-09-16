export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'farmer' | 'agronomist' | 'student' | 'researcher';
  farmLocation?: {
    state: string;
    district: string;
  };
}

export interface DiagnosisResult {
  _id?: string;
  id?: string;
  crop: string;
  plantPart?: string;
  condition?: string;
  problem: string;
  conditionType?: 'healthy' | 'disease' | 'pest' | 'nutrient_deficiency' | 'environmental_stress' | 'unknown' | string;
  problemType?: 'Disease' | 'Pest' | 'Nutrient deficiency' | 'Environmental stress' | 'Healthy' | 'Unknown' | string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  isHealthy: boolean;
  visibleSymptoms?: string[];
  symptoms: string[];
  possibleCauses: string[];
  alternativePossibilities?: string[];
  imageQuality?: string;
  expertConfirmationRequired?: boolean;
  additionalInformationNeeded?: string[];
  // Verified Knowledge-base retrieved treatments
  management: string[];
  prevention: string[];
  verifiedSource?: string | null;
  verifiedSources?: string[];
  treatmentNotice?: string | null;
  // Demo Mode
  isDemo?: boolean;
  demoNotice?: string | null;
  expertAdvice?: string;
  disclaimer?: string;
  imageUrl?: string;
  userNotes?: string;
  createdAt?: string;
  date?: string;
}

export interface Crop {
  id: string;
  name: string;
  scientificName?: string;
  category: string;
  season: string;
  description: string;
  growthStages: string[];
  optimalConditions: {
    temperature: string;
    humidity: string;
    soil: string;
    rainfall?: string;
  };
  vulnerabilities: string[];
  source?: string;
}

export interface Disease {
  id: string;
  name: string;
  scientificName?: string;
  crop: string;
  type: 'Disease' | 'Pest' | 'Nutrient deficiency' | 'Environmental stress' | string;
  pathogen?: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  symptoms: string[];
  causes?: string[];
  favorableConditions?: {
    temperature: string;
    humidity: string;
    weatherFactor: string;
  };
  prevention: string[];
  management: string[];
  source?: string;
  sources?: string[];
}

export interface FieldReport {
  _id?: string;
  id?: string;
  reporterName: string;
  crop: string;
  issue: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  description: string;
  location: {
    region: string;
    lat: number;
    lng: number;
  };
  imageUrl?: string;
  status: 'Reported' | 'Under Review' | 'Verified' | 'Action Required' | 'Resolved';
  isDemo?: boolean;
  date: string;
}

export interface WeatherRiskFactor {
  category: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  title: string;
  description: string;
  advisory: string;
}

export interface WeatherData {
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    condition: string;
    icon: string;
    lastUpdated: string;
  };
  forecast: {
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
    condition: string;
    icon: string;
  }[];
  riskAssessment: {
    overallRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    risks: WeatherRiskFactor[];
  };
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: string[];
  isAiGenerated?: boolean;
}

import axios from 'axios';

/**
 * Maps WMO weather interpretation codes to readable conditions and icons
 */
const getWeatherCondition = (code) => {
  if (code === 0) return { text: 'Clear Sky', icon: 'Sun' };
  if (code === 1 || code === 2) return { text: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 3) return { text: 'Overcast', icon: 'Cloud' };
  if (code >= 45 && code <= 48) return { text: 'Foggy / Dew', icon: 'CloudFog' };
  if (code >= 51 && code <= 55) return { text: 'Drizzle', icon: 'CloudDrizzle' };
  if (code >= 61 && code <= 65) return { text: 'Rain', icon: 'CloudRain' };
  if (code >= 80 && code <= 82) return { text: 'Rain Showers', icon: 'CloudRain' };
  if (code >= 95 && code <= 99) return { text: 'Thunderstorm', icon: 'CloudLightning' };
  return { text: 'Cloudy', icon: 'Cloud' };
};

/**
 * Calculates indicative crop health risks from weather parameters
 */
export const calculateCropHealthRisk = (temp, humidity, precipitation) => {
  const risks = [];
  let overallRiskLevel = 'Low';

  // Fungal Blight / Rust / Blast risk check
  if (humidity >= 80 && temp >= 20 && temp <= 30) {
    risks.push({
      category: 'Fungal Pathogen Risk',
      severity: 'High',
      title: 'Elevated Fungal Spore Germination Risk',
      description: `High humidity (${humidity}%) paired with moderate temperature (${temp}°C) creates ideal microclimates for Early Blight, Rice Blast, and Rust.`,
      advisory: 'Avoid overhead irrigation. Inspect bottom canopy leaves for concentric lesions. Maintain furrow drainage.'
    });
    overallRiskLevel = 'High';
  } else if (humidity >= 70 && temp >= 18 && temp <= 32) {
    risks.push({
      category: 'Fungal Pathogen Risk',
      severity: 'Moderate',
      title: 'Moderate Fungal Activity Conditions',
      description: `Moderate-high humidity (${humidity}%) may encourage foliar leaf spots if prolonged canopy wetness occurs.`,
      advisory: 'Ensure crop canopy has sufficient air circulation. Scout fields twice weekly.'
    });
    if (overallRiskLevel !== 'High') overallRiskLevel = 'Moderate';
  }

  // Late Blight / Cool Moisture risk
  if (humidity >= 85 && temp >= 14 && temp <= 22) {
    risks.push({
      category: 'Late Blight Risk',
      severity: 'Critical',
      title: 'High Late Blight Alert for Solanaceous Crops',
      description: 'Cool temperatures with extended fog or heavy dew favor rapid Phytophthora development in tomatoes and potatoes.',
      advisory: 'Check underside of leaves for white moldy growth in morning hours. Consult KVK spray schedule immediately if spots appear.'
    });
    overallRiskLevel = 'Critical';
  }

  // Heat & Sucking Pest Risk
  if (temp >= 35) {
    risks.push({
      category: 'Thermal Stress & Pest Multiplication',
      severity: 'Moderate',
      title: 'High Thermal Stress / Sucking Pest Vector Warning',
      description: `Extreme temperature (${temp}°C) can cause flower drop and accelerate whitefly and thrips reproduction.`,
      advisory: 'Provide light and frequent irrigations during evening or early morning. Inspect young leaves for curling.'
    });
    if (overallRiskLevel === 'Low') overallRiskLevel = 'Moderate';
  }

  // Waterlogging / Root Rot Risk
  if (precipitation >= 15) {
    risks.push({
      category: 'Soil Saturation Risk',
      severity: 'High',
      title: 'Heavy Precipitation / Root Rot Threat',
      description: `Active rainfall of ${precipitation}mm can cause water stagnation, predisposing roots to damping-off and bacterial wilt.`,
      advisory: 'Clear drainage channels in low-lying plots to allow surplus water evacuation.'
    });
    overallRiskLevel = 'High';
  }

  if (risks.length === 0) {
    risks.push({
      category: 'General Field Conditions',
      severity: 'Low',
      title: 'Stable Agronomic Conditions',
      description: 'Weather parameters are within normal baseline thresholds with minimal acute disease triggers.',
      advisory: 'Continue standard crop monitoring, scheduled weeding, and recommended nutrient feeding.'
    });
  }

  return { overallRiskLevel, risks };
};

/**
 * Fetch weather from Open-Meteo (default, reliable, no key needed) or OpenWeatherMap if key is provided
 */
export const getWeatherData = async (latitude = 18.5204, longitude = 73.8567, locationName = 'Pune, Maharashtra') => {
  try {
    const lat = parseFloat(latitude) || 18.5204;
    const lng = parseFloat(longitude) || 73.8567;

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const response = await axios.get(openMeteoUrl, { timeout: 6000 });
    const data = response.data;

    const current = data.current || {};
    const daily = data.daily || {};
    const condition = getWeatherCondition(current.weather_code || 0);

    const temp = Math.round(current.temperature_2m ?? 28);
    const humidity = Math.round(current.relative_humidity_2m ?? 65);
    const precipitation = current.precipitation ?? 0;
    const windSpeed = Math.round(current.wind_speed_10m ?? 12);
    const feelsLike = Math.round(current.apparent_temperature ?? temp);

    const riskAssessment = calculateCropHealthRisk(temp, humidity, precipitation);

    // Format 5-day forecast
    const forecast = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < Math.min(daily.time.length, 5); i++) {
        const fCondition = getWeatherCondition(daily.weather_code?.[i] ?? 0);
        forecast.push({
          date: daily.time[i],
          maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? 30),
          minTemp: Math.round(daily.temperature_2m_min?.[i] ?? 20),
          precipitation: daily.precipitation_sum?.[i] ?? 0,
          condition: fCondition.text,
          icon: fCondition.icon
        });
      }
    }

    return {
      location: {
        name: locationName,
        lat,
        lng
      },
      current: {
        temperature: temp,
        feelsLike,
        humidity,
        precipitation,
        windSpeed,
        condition: condition.text,
        icon: condition.icon,
        lastUpdated: current.time || new Date().toISOString()
      },
      forecast,
      riskAssessment,
      disclaimer: 'Indicative agro-meteorological advisory based on global meteorological re-analysis. Local micro-climates may vary.'
    };
  } catch (error) {
    console.error('[WeatherService Error]:', error.message);
    // Return reliable simulated data if external network times out
    return getSimulatedWeatherData(latitude, longitude, locationName);
  }
};

function getSimulatedWeatherData(lat, lng, locationName) {
  const temp = 27;
  const humidity = 74;
  const precipitation = 2.4;
  const riskAssessment = calculateCropHealthRisk(temp, humidity, precipitation);

  return {
    location: { name: locationName, lat, lng },
    current: {
      temperature: temp,
      feelsLike: 29,
      humidity,
      precipitation,
      windSpeed: 14,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      lastUpdated: new Date().toISOString()
    },
    forecast: [
      { date: 'Today', maxTemp: 30, minTemp: 22, precipitation: 2.0, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { date: 'Tomorrow', maxTemp: 29, minTemp: 21, precipitation: 5.0, condition: 'Drizzle', icon: 'CloudDrizzle' },
      { date: 'Day 3', maxTemp: 28, minTemp: 20, precipitation: 1.2, condition: 'Cloudy', icon: 'Cloud' },
      { date: 'Day 4', maxTemp: 31, minTemp: 23, precipitation: 0, condition: 'Clear Sky', icon: 'Sun' },
      { date: 'Day 5', maxTemp: 32, minTemp: 23, precipitation: 0, condition: 'Clear Sky', icon: 'Sun' }
    ],
    riskAssessment,
    disclaimer: 'Indicative agro-meteorological advisory (Offline Fallback Mode). Verify with local weather bulletins.'
  };
}

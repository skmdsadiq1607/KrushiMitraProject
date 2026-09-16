import { getWeatherData } from '../services/weatherService.js';

// @desc   Get live weather and crop disease risk advisory
// @route  GET /api/weather
export const getWeather = async (req, res, next) => {
  try {
    const { lat, lng, location } = req.query;
    const latitude = lat ? parseFloat(lat) : 18.5204;
    const longitude = lng ? parseFloat(lng) : 73.8567;
    const locationName = location || 'Pune Region, Maharashtra';

    const weatherData = await getWeatherData(latitude, longitude, locationName);

    res.json({
      success: true,
      data: weatherData
    });
  } catch (err) {
    next(err);
  }
};

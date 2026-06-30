const axios = require("axios");
const validateLocation = require("../utils/validateLocation");

// ============================
// Current Weather
// ============================
const fetchCurrentWeather = async (location) => {

  console.log("Weather API Key:", process.env.OPENWEATHER_API_KEY);

  // If the location is coordinates (latitude,longitude)
  if (location.includes(",")) {

    const [lat, lon] = location.split(",");

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: lat.trim(),
          lon: lon.trim(),
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    return response.data;
  }

  // Otherwise validate city/location
  const validation = validateLocation(location);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: location,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    }
  );

  return response.data;
};

// ============================
// 5-Day Forecast
// ============================
const fetch5DayForecast = async (lat, lon) => {

  if (!lat || !lon) {
    throw new Error("Latitude and longitude are required");
  }

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    }
  );

  return response.data;
};

// ============================
// YouTube Videos
// ============================
const fetchYouTubeVideos = async (location) => {

  if (!process.env.YOUTUBE_API_KEY) {
    return [];
  }

  try {

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${location} tourism`,
          type: "video",
          maxResults: 5,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const items = response.data.items || [];

    return items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

  } catch (error) {
    return [];
  }
};

// ============================
// Google Maps Geocoding
// ============================
const fetchMapData = async (location) => {

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return null;
  }

  // Skip Geocoding if coordinates are passed
  if (location.includes(",")) {

    const [lat, lng] = location.split(",");

    return {
      lat: Number(lat),
      lng: Number(lng),
      formattedAddress: "Current Location",
    };
  }

  const validation = validateLocation(location);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address: location,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    }
  );

  if (
    response.data.status !== "OK" ||
    response.data.results.length === 0
  ) {
    return null;
  }

  const result = response.data.results[0];

  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  };
};

module.exports = {
  fetchCurrentWeather,
  fetch5DayForecast,
  fetchYouTubeVideos,
  fetchMapData,
  validateLocation,
};
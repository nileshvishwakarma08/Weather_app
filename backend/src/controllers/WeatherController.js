const Weather = require('../models/Weather');
const PDFDocument = require('pdfkit');
const {
  fetchCurrentWeather,
  fetch5DayForecast,
  fetchYouTubeVideos,
  fetchMapData,
  validateLocation
} = require('../services/WeatherService');

const createWeatherRecord = async (req, res) => {
      console.log("========== REQUEST RECEIVED ==========");
      console.log(req.body);
  try {
    const { location, startDate, endDate } = req.body;

    const validation = validateLocation(location);
    // Validate date range if provided
    if (startDate && endDate) {

      const start = new Date(startDate);
      const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            error: "Invalid date format."
        });
    }

    if (start > end) {
        return res.status(400).json({
            error: "Start date cannot be after end date."
        });
    }

}
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    let weatherData;
    try {
  weatherData = await fetchCurrentWeather(location);
} catch (error) {

  console.log("========== WEATHER API ERROR ==========");
  console.log(error.response?.status);
  console.log(error.response?.data);
  console.log(error.message);

  if (error.response && error.response.status === 404) {
    return res.status(404).json({ error: 'City not found' });
  }

  return res.status(500).json({
    error: "Failed to fetch weather data"
  });
}
    let mapData = null;
    let videos = [];
    let lat = weatherData.coord?.lat;
    let lon = weatherData.coord?.lon;

    try {
      mapData = await fetchMapData(location);
    } catch (error) {
      // Continue without mapData on error
    }

    try {
      videos = await fetchYouTubeVideos(location);
    } catch (error) {
      // Continue without videos on error
    }

    let forecast = [];
    if (lat && lon) {
      try {
        const forecastData = await fetch5DayForecast(lat, lon);
        forecast = forecastData.list.map(item => ({
          dt: item.dt,
          temp: item.main.temp,
          feels_like: item.main.feels_like,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          wind_speed: item.wind.speed
        }));
      } catch (error) {
        // Continue without forecast on error
      }
    }

    const weatherRecord = new Weather({
      dateRange: {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null
      },
      location: weatherData.name,
      lat: weatherData.coord?.lat,
      lon: weatherData.coord?.lon,
      currentTemp: weatherData.main?.temp,
      feelsLike: weatherData.main?.feels_like,
      humidity: weatherData.main?.humidity,
      description: weatherData.weather?.[0]?.description,
      icon: weatherData.weather?.[0]?.icon,
      windSpeed: weatherData.wind?.speed,
      forecast,
      videos,
      mapData
    });

    const savedRecord = await weatherRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllRecords = async (req, res) => {
  try {
    const records = await Weather.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await Weather.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid record ID' });
    }
    res.status(500).json({ error: 'Failed to fetch record' });
  }
};

const updateRecord = async (req, res) => {
  try {
    const updatedRecord = await Weather.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(updatedRecord);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid record ID' });
    }
    res.status(500).json({ error: 'Failed to update record' });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await Weather.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully', record: deletedRecord });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid record ID' });
    }
    res.status(500).json({ error: 'Failed to delete record' });
  }
};

const exportData = async (req, res) => {
  try {
    const { format } = req.params;
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate && endDate) {
      query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const records = await Weather.find(query);

    switch (format.toLowerCase()) {
      case 'json':
        return res.json(records);

      case 'xml':
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
        records.forEach(record => {
          xml += '  <record>\n';
          xml += `    <location>${record.location}</location>\n`;
          xml += `    <currentTemp>${record.currentTemp}</currentTemp>\n`;
          xml += `    <description>${record.description}</description>\n`;
          xml += `    <createdAt>${record.createdAt}</createdAt>\n`;
          xml += '  </record>\n';
        });
        xml += '</records>';
        res.setHeader('Content-Type', 'application/xml');
        return res.send(xml);

      case 'csv':
        let csv = 'location,currentTemp,feelsLike,humidity,description,icon,windSpeed,createdAt\n';
        records.forEach(record => {
          csv += `${record.location},${record.currentTemp},${record.feelsLike},${record.humidity},"${record.description}",${record.icon},${record.windSpeed},${record.createdAt}\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        return res.send(csv);

      case 'markdown':
        let md = '# Weather Records\n\n';
        records.forEach(record => {
          md += `## ${record.location}\n\n`;
          md += `- **Temperature:** ${record.currentTemp}°C\n`;
          md += `- **Feels Like:** ${record.feelsLike}°C\n`;
          md += `- **Humidity:** ${record.humidity}%\n`;
          md += `- **Description:** ${record.description}\n`;
          md += `- **Wind Speed:** ${record.windSpeed} m/s\n`;
          md += `- **Created At:** ${record.createdAt}\n\n`;
        });
        res.setHeader('Content-Type', 'text/markdown');
        return res.send(md);

      case 'pdf': {

    const doc = new PDFDocument();

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=weather_records.pdf"
    );

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    doc.pipe(res);

    doc.fontSize(22).text("Weather Records Report", {
        align: "center"
    });

    doc.moveDown();

    records.forEach((record, index) => {

        doc.fontSize(16).text(`Record ${index + 1}`);

        doc.fontSize(12).text(`Location : ${record.location}`);
        doc.text(`Temperature : ${record.currentTemp} °C`);
        doc.text(`Feels Like : ${record.feelsLike} °C`);
        doc.text(`Humidity : ${record.humidity}%`);
        doc.text(`Description : ${record.description}`);
        doc.text(`Wind Speed : ${record.windSpeed} m/s`);
        doc.text(`Created At : ${record.createdAt}`);

        doc.moveDown();

    });

    doc.end();

    return;

}

      default:
        return res.status(400).json({ error: 'Unsupported format. Supported: json, xml, csv, markdown, pdf' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
};

module.exports = {
  createWeatherRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  exportData
};
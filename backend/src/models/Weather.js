const mongoose = require('mongoose');

const WeatherRecordSchema = new mongoose.Schema({
  location: { type: String, required: true },
  lat: { type: Number },
  lon: { type: Number },
  currentTemp: { type: Number },
  feelsLike: { type: Number },
  humidity: { type: Number },
  description: { type: String },
  icon: { type: String },
  windSpeed: { type: Number },
  forecast: { type: Array, default: [] },
  videos: { type: Array, default: [] },
  mapData: { type: Object, default: {} },
  dateRange: {
    start: { type: Date },
    end: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

WeatherRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WeatherRecord', WeatherRecordSchema);

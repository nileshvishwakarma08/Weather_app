const express = require('express');
const router = express.Router();
const WeatherController = require('../controllers/WeatherController');

router.post('/', WeatherController.createWeatherRecord);
router.get('/', WeatherController.getAllRecords);
router.get('/:id', WeatherController.getRecordById);
router.put('/:id', WeatherController.updateRecord);
router.delete('/:id', WeatherController.deleteRecord);
router.get('/export/:format', WeatherController.exportData);

module.exports = router;

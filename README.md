# 🌤️ Full Stack Weather Application

**Developed By:** Nilesh Vishwakarma

This project was developed as part of the **PM Accelerator AI Engineer Intern Technical Assessment**. It demonstrates full-stack development skills by integrating a React frontend, Node.js/Express backend, MongoDB database, and multiple third-party APIs to provide real-time weather information and data persistence.

---

# Assessment Completed

✅ Tech Assessment #1 – Frontend Weather Application

✅ Tech Assessment #2 – Backend Weather Application

---

# Features

## Frontend

* Search weather by:

  * City
  * Town
  * Landmark
  * Zip/Postal Code
  * GPS Coordinates
* Browser Geolocation (Current Location)
* Current Weather Display
* 5-Day Weather Forecast
* Weather Icons
* Responsive Layout
* Error Handling
* Saved Weather Records
* Export Buttons

---

## Backend

* RESTful API
* MongoDB Atlas Integration
* CRUD Operations

  * Create
  * Read
  * Update
  * Delete
* Date Range Validation
* Location Validation
* Input Validation
* Rate Limiting
* Error Handling

---

# API Integrations

## OpenWeather API

Used for:

* Current Weather
* Temperature
* Humidity
* Wind Speed
* Weather Description
* Weather Icons
* 5-Day Forecast

---

## Google Geocoding API

Used for:

* Latitude
* Longitude
* Formatted Address
* Google Maps Location Information

---

## YouTube Data API

Used for:

* Tourism Videos
* Travel Videos
* Location Related Recommendations

---

# Data Export

The application supports exporting weather records in the following formats:

* JSON
* CSV
* XML
* Markdown
* PDF

---

# Technology Stack

## Frontend

* React.js
* Axios
* JavaScript
* HTML5
* CSS3

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* PDFKit

## External APIs

* OpenWeather API
* Google Geocoding API
* YouTube Data API

---

# Project Structure

```
Weather_App/

├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd Weather_App
```

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update the `.env` file with your own credentials.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Run the backend:

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Open:

```
http://localhost:3000
```

---

# REST API Endpoints

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| POST   | /api/weather                 | Create Weather Record |
| GET    | /api/weather                 | Get All Records       |
| GET    | /api/weather/:id             | Get Record By ID      |
| PUT    | /api/weather/:id             | Update Record         |
| DELETE | /api/weather/:id             | Delete Record         |
| GET    | /api/weather/export/json     | Export JSON           |
| GET    | /api/weather/export/csv      | Export CSV            |
| GET    | /api/weather/export/xml      | Export XML            |
| GET    | /api/weather/export/markdown | Export Markdown       |
| GET    | /api/weather/export/pdf      | Export PDF            |

---

# Validation & Error Handling

* Invalid city handling
* Invalid date validation
* Invalid record ID handling
* API request failure handling
* Database error handling
* Rate limiting
* Empty input validation

---

# About PM Accelerator

PM Accelerator is a career accelerator that helps aspiring professionals build successful careers in Artificial Intelligence, Product Management, and Software Engineering through mentorship, real-world projects, interview preparation, and hands-on technical learning.

---

# Future Improvements

* Interactive Google Maps
* Air Quality Index (AQI)
* Weather Charts
* Dark Mode
* Favorite Locations
* AI Weather Assistant
* Weather Alerts & Notifications

---

# Author

**Nilesh Vishwakarma**

AI & Data Science Graduate

Mumbai, India

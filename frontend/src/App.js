import React, { useState, useEffect } from 'react';
import WeatherApp from './components/WeatherApp';
import SearchBar from './components/SearchBar';
import { fetchWeather, getRecords, deleteRecord, exportData } from './services/API';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await getRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load records');
    }
  };

  const handleSearch = async (location) => {
    console.log("Searching for:", location);
    setLoading(true);
    setError('');

    try {
      const data = await fetchWeather(location);
      setCurrentWeather(data);
      setForecast(data.forecast || []);
      setCurrentLocation(data.location || location);
      await loadRecords();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch weather');
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude},${longitude}`;
        setCurrentLocation(location);

        try {
          const data = await fetchWeather(location);
          setCurrentWeather(data);
          setForecast(data.forecast || []);
        } catch (err) {
          setError(err.response?.data?.error || err.message || 'Failed to fetch weather for your location');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this weather record?")) {
      return;
    }

    try {
      await deleteRecord(id);
      await loadRecords();
    } catch (err) {
      setError('Failed to delete record');
    }
  };

  const handleExport = async (format) => {
    try {
      const blob = await exportData(format);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute('download', `weather-data.${format}`);

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {
      setError('Failed to export data');
    }
  };

  return (
    <div style={styles.app}>

      <h1 style={styles.title}>🌤 Weather App</h1>

      <SearchBar
        onSearch={handleSearch}
        onGeolocation={handleGeolocation}
      />

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {loading && (
        <div style={styles.loading}>
          Loading...
        </div>
      )}

      {currentWeather && (
        <WeatherApp
          weather={currentWeather}
          forecast={forecast}
        />
      )}

      <div style={styles.section}>

        <h2>Saved Weather Records</h2>

        <div style={styles.exportButtons}>
          {['json', 'csv', 'xml', 'markdown', 'pdf'].map(format => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              style={styles.exportBtn}
            >
              Export {format.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={styles.records}>

          {records.map(record => (

            <div
              key={record._id}
              style={styles.record}
            >

              <div>
                <strong>{record.location}</strong>
              </div>

              <div>
                {record.currentTemp}°C • {record.description}
              </div>

              <div style={styles.recordMeta}>
                Humidity: {record.humidity}% • Wind: {record.windSpeed} m/s
              </div>

              <button
                onClick={() => handleDelete(record._id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </div>

      <hr style={{ marginTop: "50px" }} />

      <div style={styles.footer}>
        <h2>Developed By</h2>

        <h3>Nilesh Vishwakarma</h3>

        <p>
          <strong>About PM Accelerator</strong>
        </p>

        <p>
          PM Accelerator is a global career accelerator that helps aspiring
          professionals build successful careers in Artificial Intelligence,
          Product Management, and Software Engineering through mentorship,
          hands-on projects, interview preparation, and real-world technical
          experience.
        </p>
      </div>

    </div>
  );
}

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },

  title: {
    textAlign: 'center',
    color: '#333'
  },

  error: {
    color: 'red',
    textAlign: 'center',
    margin: '10px 0'
  },

  loading: {
    textAlign: 'center',
    margin: '10px 0',
    color: '#666'
  },

  section: {
    marginTop: '40px'
  },

  exportButtons: {
    marginBottom: '15px'
  },

  exportBtn: {
    marginRight: '8px',
    padding: '8px 14px',
    cursor: 'pointer'
  },

  records: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
    gap: '15px'
  },

  record: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    background: '#f9f9f9'
  },

  recordMeta: {
    fontSize: '0.9em',
    color: '#666',
    margin: '5px 0'
  },

  deleteBtn: {
    marginTop: '8px',
    padding: '6px 12px',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },

  footer: {
    marginTop: '40px',
    padding: '25px',
    textAlign: 'center',
    background: '#f4f4f4',
    borderRadius: '10px',
    color: '#333',
    lineHeight: '1.8'
  }
};

export default App;
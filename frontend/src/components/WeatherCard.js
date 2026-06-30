import React from 'react';

function WeatherCard({ data }) {
  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return '\u2600\uFE0F';
    if (iconCode.includes('01')) return '\u2600\uFE0F';
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return '\u2601\uFE0F';
    if (iconCode.includes('09') || iconCode.includes('10')) return '\uD83C\uDF27\uFE0F';
    if (iconCode.includes('11')) return '\uD83D\uDD25';
    if (iconCode.includes('13')) return '\u2744\uFE0F';
    if (iconCode.includes('50')) return '\uD83C\uDF2C\uFE0F';
    return '\u2600\uFE0F';
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.location}>{data.location}</h3>
      <div style={styles.icon}>{getWeatherIcon(data.icon)}</div>
      <div style={styles.temp}>{Math.round(data.currentTemp)}°C</div>
      <div style={styles.description}>{data.description}</div>
      <div style={styles.details}>
        <div>Feels like: {Math.round(data.feelsLike)}°C</div>
        <div>Humidity: {data.humidity}%</div>
        <div>Wind: {data.windSpeed} m/s</div>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  location: { margin: '0 0 10px 0', color: '#333' },
  icon: { fontSize: '3em' },
  temp: { fontSize: '2.5em', fontWeight: 'bold', color: '#333', margin: '10px 0' },
  description: { fontSize: '1.1em', color: '#666', textTransform: 'capitalize' },
  details: { marginTop: '15px', fontSize: '0.9em', color: '#555' }
};

export default WeatherCard;

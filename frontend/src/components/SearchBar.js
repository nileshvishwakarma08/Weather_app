import React, { useState } from 'react';

function SearchBar({ onSearch, onGeolocation }) {
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location (city, zip, coordinates, landmark...)"
        style={styles.input}
      />
      <button type="submit" style={styles.searchBtn}>Search</button>
      <button type="button" onClick={onGeolocation} style={styles.geoBtn}>
        Use Current Location
      </button>
    </form>
  );
}

const styles = {
  form: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  input: { flex: '1', minWidth: '200px', padding: '12px 15px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '8px' },
  searchBtn: { padding: '12px 24px', fontSize: '16px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  geoBtn: { padding: '12px 24px', fontSize: '16px', background: '#48bb78', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default SearchBar;

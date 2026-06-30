import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/weather';

export const fetchWeather = async (location) => {
  const { data } = await axios.post(`${API_BASE}`, { location });
  return data;
};

export const getRecords = async () => {
  const { data } = await axios.get(`${API_BASE}`);
  return data;
};

export const getRecordById = async (id) => {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  return data;
};

export const updateRecord = async (id, updates) => {
  const { data } = await axios.put(`${API_BASE}/${id}`, updates);
  return data;
};

export const deleteRecord = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/${id}`);
  return data;
};

export const exportData = async (format) => {
  const { data } = await axios.get(`${API_BASE}/export/${format}`, { responseType: 'blob' });
  return data;
};

import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'bc600a4d98f564d39b29f97bc16318db';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const url = `${BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
    
      setWeatherData({
        cityName: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].description,
        icon: data.weather[0].icon
      });
      
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };


  const handleInputChange = (e) => {
    setCity(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌤️ Weather Search</h1>
      </header>
      
      <main className="app-main">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city name..."
            className="city-input"
            aria-label="City name"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && <p className="loading">Loading...</p>}

        {error && <p className="error">⚠️ {error}</p>}

        {weatherData && !loading && (
          <div className="weather-card" aria-live="polite">
            <h2 className="city-name">{weatherData.cityName}</h2>
            
            {weatherData.icon && (
              <img 
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
                alt={weatherData.condition}
                className="weather-icon"
              />
            )}
            
            <p className="temperature">
              {weatherData.temperature}°C
            </p>
            <p className="condition">
              {weatherData.condition.charAt(0).toUpperCase() + weatherData.condition.slice(1)}
            </p>
          </div>
        )}

        {!weatherData && !loading && !error && (
          <p className="hint">🔍 Enter a city name to get current weather</p>
        )}
      </main>
    </div>
  );
}

export default App;
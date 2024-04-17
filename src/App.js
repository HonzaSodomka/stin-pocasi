import React, { useState, useEffect } from 'react';
import searchImage from './assets/search.png';
import sunImage from './assets/sun.png';
import humidityImage from './assets/humidity.png';
import windImage from './assets/wind.png';

const apiKey = "99cbbc452293ccefcc5dda5b3ad9dc15";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

function App() {
  const [city, setCity] = useState("Praha");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkWeather(city) {
    try {
      setLoading(true);
      const response = await fetch(apiUrl + city + `&appid=` + apiKey);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Chyba při získávání dat o počasí:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkWeather(city);
  }, []);
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkWeather(city);
    }
  };

  return (
    <div className="block">
      <div className="search">
        <input type="text" placeholder="Zadejte město" onChange={(e) => setCity(e.target.value)} value={city} onKeyPress={handleKeyPress}></input>
      </div>
      <div className="weather">
        <h2 className="city">{weatherData ? weatherData.name : 'Praha'}</h2>
        <img src={sunImage} className="weather-icon" alt=""></img>
        <h1 className="temp">{loading ? 'Načítání...' : (weatherData ? `${weatherData.main.temp.toFixed(1)}°C` : 'N/A')}</h1>
        <div className="details">
          <div className="col">
            <img src={humidityImage} alt=""></img>
            <div>
              <p className="humidity">{loading ? 'Načítání...' : (weatherData ? `${weatherData.main.humidity}%` : 'N/A')}</p>
              <p>Vlhkost</p>
            </div>
          </div>
          <div className="col">
            <img src={windImage} alt=""></img>
            <div>
              <p className="wind">{loading ? 'Načítání...' : (weatherData ? `${weatherData.wind.speed.toFixed(1)} km/h` : 'N/A')}</p>
              <p className="desc">Rychlost větru</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

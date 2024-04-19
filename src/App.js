import React, { useState, useEffect } from 'react';
import sunImage from './assets/sun.png';
import humidityImage from './assets/humidity.png';
import windImage from './assets/wind.png';

const apiKey = "99cbbc452293ccefcc5dda5b3ad9dc15";
const apiAdress = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

function App() {
  const [temperature, setTemperature] = useState("Loading...");
  const [humidity, setHumidity] = useState("Loading...");
  const [wind, setWind] = useState("Loading...");
  const [city, setCity] = useState("Praha");
  const [searchedCity, setSearchedCity] = useState("Praha");

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchedCity(event.target.value);
      event.target.value = "";
    }
  };
  
  useEffect(() => {
    const apiUrl = `${apiAdress}${searchedCity}&appid=${apiKey}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTemperature(data.main.temp + " °C");
        setHumidity(data.main.humidity + " %");
        setWind(data.wind.speed + " km/h");
        setCity(data.name)
      })
      .catch(error => {
        console.error('Chyba při získávání dat:', error);
      });
  }, [searchedCity]);

  return (
    <div className="block">
      <div className="search">
        <input type="text" placeholder="Zadejte město" onKeyDown={handleKeyDown}></input>
      </div>
      <div className="weather">
        <h2 className="city">{city}</h2>
        <img src={sunImage} className="weather-icon" alt=""></img>
        <h1 className="temp">{temperature}</h1>
        <div className="details">
          <div className="col">
            <img src={humidityImage} alt=""></img>
            <div>
              <p className="humidity">{humidity}</p>
              <p>Vlhkost</p>
            </div>
          </div>
          <div className="col">
            <img src={windImage} alt=""></img>
            <div>
              <p className="wind">{wind}</p>
              <p className="desc">Rychlost větru</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

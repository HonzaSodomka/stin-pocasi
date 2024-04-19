import React, { useState, useEffect } from 'react';
import sunImage from './assets/sun.png';
import humidityImage from './assets/humidity.png';
import windImage from './assets/wind.png';
import brokenCloudsImage from './assets/brokenclouds.png'
import fewCloudsImage from './assets/fewclouds.png'
import mistImage from './assets/mist.png'
import scatteredCloudsImage from './assets/scatteredclouds.png'
import showerRainImage from './assets/showerrain.png'
import snowImage from './assets/snow.png'
import thunderstormImage from './assets/thunderstorm.png'
import moonImage from './assets/moon.png'
import fewCloudsNImage from './assets/fewcloudsn.png'
import rainNImage from './assets/rainn.png'
import rainImage from './assets/rain.png'


const apiKey = "99cbbc452293ccefcc5dda5b3ad9dc15";
const apiAdress = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

function App() {
  const [temperature, setTemperature] = useState("Loading...");
  const [humidity, setHumidity] = useState("Loading...");
  const [wind, setWind] = useState("Loading...");
  const [city, setCity] = useState("Praha");
  const [searchedCity, setSearchedCity] = useState("Praha");
  const [weatherImage, setWeatherImage] = useState({sunImage})

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchedCity(event.target.value);
      event.target.value = "";
    }
  };

  const setWeatherStatus = (status) => {
    switch (status) {
      case "01d":
        setWeatherImage(sunImage);
        break;
      case "01n":
        setWeatherImage(moonImage);
        break;
      case "02d":
        setWeatherImage(fewCloudsImage);
        break;
      case "02n":
        setWeatherImage(fewCloudsNImage);
        break;
      case "04d", "04n":
        setWeatherImage(brokenCloudsImage);
        break;
      case "02d":
        setWeatherImage(fewCloudsImage);
        break;
      case "50d", "50n":
        setWeatherImage(mistImage);
        break;
      case "03d", "03n":
        setWeatherImage(scatteredCloudsImage);
        break;
      case "09d", "09n":
        setWeatherImage(showerRainImage);
        break;
      case "13d", "13n":
        setWeatherImage(snowImage);
        break;
      case "11d", "11n":
        setWeatherImage(thunderstormImage);
        break;
      case "10d":
        setWeatherImage(rainImage)
        break;
      case "10n":
        setWeatherImage(rainNImage)
        break;
      default:
        setWeatherImage(sunImage);
        break;
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
        setTemperature(data.main.temp.toFixed(1)  + " °C");
        setHumidity(data.main.humidity+ " %");
        setWind(data.wind.speed.toFixed(1)  + " km/h");
        setCity(data.name);
        setWeatherStatus(data.weather[0].icon);
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
        <img src={weatherImage} className="weather-icon" alt=""></img>
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

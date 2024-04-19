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

const cityApi = "http://api.openweathermap.org/geo/1.0/direct?q="

function App() {
  const [temperature, setTemperature] = useState("Loading...");
  const [humidity, setHumidity] = useState("Loading...");
  const [wind, setWind] = useState("Loading...");
  const [city, setCity] = useState("Praha");
  const [searchedCity, setSearchedCity] = useState("Praha");
  const [weatherImage, setWeatherImage] = useState({sunImage});
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");


  var d = new Date()
  var dOneDay = d.getDate(d.setDate(d.getDate() - 1))
  var dOneMonth = d.getMonth(d.setDate(d.getDate()))+1
  var dOneYear = d.getFullYear(d.setDate(d.getDate()))
  var dTwoDay = d.getDate(d.setDate(d.getDate() - 1))
  var dTwoMonth = d.getMonth(d.setDate(d.getDate()))+1
  var dTwoYear = d.getFullYear(d.setDate(d.getDate()))
  var dThreeDay = d.getDate(d.setDate(d.getDate() - 1))
  var dThreeMonth = d.getMonth(d.setDate(d.getDate()))+1
  var dThreeYear = d.getFullYear(d.setDate(d.getDate()))
  var dFourDay = d.getDate(d.setDate(d.getDate() - 1))
  var dFourMonth = d.getMonth(d.setDate(d.getDate()))+1
  var dFourYear = d.getFullYear(d.setDate(d.getDate()))
  var dFiveDay = d.getDate(d.setDate(d.getDate() - 1))
  var dFiveMonth = d.getMonth(d.setDate(d.getDate()))+1
  var dFiveYear = d.getFullYear(d.setDate(d.getDate()))
  var dSixDay = d.getDate(d.setDate(d.getDate() - 1))
  var dSixMonth = d.getMonth(d.setDate(d.getDate()))+1
  var dSixYear = d.getFullYear(d.setDate(d.getDate()))
  var dSevenDay = d.getDate(d.setDate(d.getDate() - 1))
  var dSevenMonth = d.getMonth(d.setDate(d.getDate()))+1
  var dSevenYear = d.getFullYear(d.setDate(d.getDate()))



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
      case "04d":
      case "04n":
        setWeatherImage(brokenCloudsImage);
        break;
      case "50d":
      case "50n":
        setWeatherImage(mistImage);
        break;
      case "03d":
      case "03n":
        setWeatherImage(scatteredCloudsImage);
        break;
      case "09d":
      case "09n":
        setWeatherImage(showerRainImage);
        break;
      case "13d":
      case "13n":
        setWeatherImage(snowImage);
        break;
      case "11d":
      case "11n":
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
    const cityApiUrl = `${cityApi}${searchedCity}&limit=1&appid=${apiKey}`;
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
    fetch(cityApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLong(data[0].lon+10);
        setLat(data[0].lat);
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
      <div className = "history">
      <table border="1">
        <thead>
            <tr>
                <th>Date</th>
                <th>Highest temp</th>
                <th>Lowest temp</th>
                <th>Rain</th>
                <th>Clouds</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{dOneDay}.{dOneMonth}.{dOneYear}</td>
                <td>{long}</td>
                <td>{lat}</td>
                <td>Řádek 1, Sloupec 4</td>
                <td>Řádek 1, Sloupec 5</td>
            </tr>
            <tr>
                <td>{dTwoDay}.{dTwoMonth}.{dTwoYear}</td>
                <td>Řádek 2, Sloupec 2</td>
                <td>Řádek 2, Sloupec 3</td>
                <td>Řádek 2, Sloupec 4</td>
                <td>Řádek 2, Sloupec 5</td>
            </tr>
            <tr>
                <td>{dThreeDay}.{dThreeMonth}.{dThreeYear}</td>
                <td>Řádek 3, Sloupec 2</td>
                <td>Řádek 3, Sloupec 3</td>
                <td>Řádek 3, Sloupec 4</td>
                <td>Řádek 3, Sloupec 5</td>
            </tr>
            <tr>
                <td>{dFourDay}.{dFourMonth}.{dFourYear}</td>
                <td>Řádek 4, Sloupec 2</td>
                <td>Řádek 4, Sloupec 3</td>
                <td>Řádek 4, Sloupec 4</td>
                <td>Řádek 4, Sloupec 5</td>
            </tr>
            <tr>
                <td>{dFiveDay}.{dFiveMonth}.{dFiveYear}</td>
                <td>Řádek 5, Sloupec 2</td>
                <td>Řádek 5, Sloupec 3</td>
                <td>Řádek 5, Sloupec 4</td>
                <td>Řádek 5, Sloupec 5</td>
            </tr>
            <tr>
                <td>{dSixDay}.{dSixMonth}.{dSixYear}</td>
                <td>Řádek 6, Sloupec 2</td>
                <td>Řádek 6, Sloupec 3</td>
                <td>Řádek 6, Sloupec 4</td>
                <td>Řádek 6, Sloupec 5</td>
            </tr>
            <tr>
                <td>{dSevenDay}.{dSevenMonth}.{dSevenYear}</td>
                <td>Řádek 7, Sloupec 2</td>
                <td>Řádek 7, Sloupec 3</td>
                <td>Řádek 7, Sloupec 4</td>
                <td>Řádek 7, Sloupec 5</td>
            </tr>
        </tbody>
    </table>
      </div>
    </div>
    
  );
}

export default App;

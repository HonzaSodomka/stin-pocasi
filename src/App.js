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
import favorite1 from './assets/favorite.png'
import favorite2 from './assets/favorite2.png'
import axios from 'axios';

var userName = "";
const apiKey = "99cbbc452293ccefcc5dda5b3ad9dc15";
const apiAdress = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const historyApi = "https://api.open-meteo.com/v1/forecast?"
const historyApiSet = "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum&timezone=auto&"


function App() {
  const usersData = require('./users.json')
  const [favorites, setFavorites] = useState("");
  const [favoriteButton, setFavoriteButton] = useState("");

  const handleRegistration = async () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const response = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Users');
    const userData = response.data;
    const userExists = userData.find(user => user.username === username);
    if (userExists) {
      alert('Uživatelské jméno již existuje. Přihlaste se nebo zvolte jiné.');
    }
    else if (usernameInput.value.length < 4) {
      alert("Uživatelské jméno musí být dlouhé alespoň 4 znaky.")
    }
    else if (passwordInput.value.length < 5) {
      alert("Heslo musí být dlouhé alespoň 5 znaků.")
    }
    else {
      try {
      const response = await axios.post('https://stin-backend-apimanag.azure-api.net/api/Users', {
        username: usernameInput.value,
        password: passwordInput.value,
        pay: "no"
      });
      console.log(response)
      setHead(payment);
      setFavorites("---");
    } catch (error) {
      console.error('Chyba při vytváření uživatele:', error);
      alert('Došlo k chybě při vytváření uživatele. Zkuste to prosím znovu.');
    }
  };}

  const handleLogin = async () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;
    const response = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Users');
    const userData = response.data;
    const userExists = userData.find(user => user.username === username);
    const passwordMatch = userData.find(user => user.username === username && user.password === password)
    const pay = userData.find(user => user.username === username && user.password === password && user.pay === "yes")
    if (userExists && passwordMatch && pay) {
      userName = username;
      setUser("valid");
      setHead(logout);
      const response = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Favorites');
      const favorites = response.data;
      const userFavorites = favorites.filter(favorite => favorite.user_id === passwordMatch.id);
      const cityNames = ["---", ...userFavorites.map(item => item.city)];
       const selectOptions = cityNames.map(city => <option key={city}>{city}</option>);
       const selectElement = (
           <select>
               {selectOptions}
           </select>
       );
       setFavorites(selectElement);
    } 
    else if (userExists && passwordMatch) {
      userName = username;
      setUserId(passwordMatch.id)
      setUser("valid");
      setHead(payment);
    } 
    else {
      if (userExists) {
        alert("Špatně zadané heslo.");
      } else {
        alert("Uživatelské jméno neexistuje nebo je špatně zadané");
      }
    }
  };

  const handleLogout = () => {
    userName = ""
    setUser("")
    setHead(login)
  }

  const handlePayment = () => {
    const cardInput = document.getElementById('cardnumber');
    const validInput = document.getElementById('validity');
    const cvcInput = document.getElementById('cvc');

    if (cardInput.value.length !== 19) {
      alert("Zadejte číslo karty ve formátu XXXX XXXX XXXX XXXX.")
    }

    else if (validInput.value.length !== 5) {
      alert("Zadejte platnost karty ve formátu MM/YY.")
    }

    else if (cvcInput.value.length !== 3) {
      alert("Zadejte CVC ve formátu XXX.")
    }
    else {
      setUser("valid")
      setHead(logout)
    }
  }

  const login = <div className="head">
    <div className="text">
      Pro prémiové služby* se prosím přihlaste:
    </div>
    <div className="log">
      <div className="inputs">
        <input type="text" id="username" placeholder="Uživatelské jméno"></input>
        <input type="password" id="password" placeholder="Heslo"></input>
      </div>
      <div className="buttons">
        <button onClick={handleLogin}>Přihlásit se</button>
        <button onClick={handleRegistration}>Registrovat</button>
      </div>
    </div>
  </div>

  const [head, setHead] = useState(login);

  const payment = (
    <div className="payment">
      <div className="number">
        <input type="text" id="cardnumber" placeholder="Číslo karty"></input>
      </div>
      <div>
        <input type="text" id="validity" placeholder="Platnost karty"></input>
        <input type="text" id="cvc" placeholder="CVC"></input>
        <button onClick={handlePayment}>Zaplatit</button>
      </div>
    </div>
  );


  const premium = (
    <div className="bot">
      *Prémiovými službami se rozumí zobrazení historie počasí 7 dní zpátky a možnost ukládat si oblíbená místa. Při registraci je vyžadován jednorázový poplatek 99 Kč.
    </div>
  );

  const logout = (
    <div className="logout">
      <button onClick={handleLogout}>Odhlásit</button>
    </div>
  )
  const [temperature, setTemperature] = useState("Loading...");
  const [humidity, setHumidity] = useState("Loading...");
  const [wind, setWind] = useState("Loading...");
  const [city, setCity] = useState("Liberec");
  const [searchedCity, setSearchedCity] = useState("Liberec");
  const [weatherImage, setWeatherImage] = useState({ sunImage });
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [precipitation, setPrecipitation] = useState("")
  const [rain, setRain] = useState("")
  const [shower, setShower] = useState("")
  const [snow, setSnow] = useState("")

  const [user, setUser] = useState("")
  const [userId, setUserId] = useState("")

  var d = new Date()
  var dOneDay = (d.getDate(d.setDate(d.getDate() - 1))).toString().padStart(2, '0');
  var dOneMonth = (d.getMonth(d.setDate(d.getDate())) + 1).toString().padStart(2, '0');
  var dOneYear = d.getFullYear(d.setDate(d.getDate()))
  var dTwoDay = d.getDate(d.setDate(d.getDate() - 1)).toString().padStart(2, '0');
  var dTwoMonth = (d.getMonth(d.setDate(d.getDate())) + 1).toString().padStart(2, '0');
  var dTwoYear = d.getFullYear(d.setDate(d.getDate()))
  var dThreeDay = d.getDate(d.setDate(d.getDate() - 1)).toString().padStart(2, '0');
  var dThreeMonth = (d.getMonth(d.setDate(d.getDate())) + 1).toString().padStart(2, '0');
  var dThreeYear = d.getFullYear(d.setDate(d.getDate()))
  var dFourDay = d.getDate(d.setDate(d.getDate() - 1)).toString().padStart(2, '0');
  var dFourMonth = (d.getMonth(d.setDate(d.getDate())) + 1).toString().padStart(2, '0');
  var dFourYear = d.getFullYear(d.setDate(d.getDate()))
  var dFiveDay = d.getDate(d.setDate(d.getDate() - 1)).toString().padStart(2, '0');
  var dFiveMonth = (d.getMonth(d.setDate(d.getDate())) + 1).toString().padStart(2, '0');
  var dFiveYear = d.getFullYear(d.setDate(d.getDate()))
  var dSixDay = d.getDate(d.setDate(d.getDate() - 1)).toString().padStart(2, '0');
  var dSixMonth = (d.getMonth(d.setDate(d.getDate())) + 1).toString().padStart(2, '0');
  var dSixYear = d.getFullYear(d.setDate(d.getDate()))
  var dSevenDay = d.getDate(d.setDate(d.getDate() - 1)).toString().padStart(2, '0');
  var dSevenMonth = (d.getMonth(d.setDate(d.getDate())) + 1).toString().padStart(2, '0');
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
        setWeatherImage(rainImage);
        break;
      case "10n":
        setWeatherImage(rainNImage);
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
        setTemperature(data.main.temp.toFixed(1) + " °C");
        setHumidity(data.main.humidity + " %");
        setWind(data.wind.speed.toFixed(1) + " km/h");
        setCity(data.name);
        setWeatherStatus(data.weather[0].icon);
        setLong(data.coord.lon);
        setLat(data.coord.lat);
        if (user === "valid") {
          const userData = usersData.users.find(user => user.username === userName);
          const favorites = userData.favorites;
          for (let i = 0; i < favorites.length; i++) {
            if (favorites[i] === data.name) {
              setFavoriteButton(<button><img src={favorite2} className="fav-icon" alt=""></img></button>);
              return; // Pokud je město v oblíbených, nastav tlačítko a ukonči funkci
            }
          }
        }
        // Pokud uživatel není "valid" nebo město není v oblíbených, nastav tlačítko na favorite1
        setFavoriteButton(<button><img src={favorite1} className="fav-icon" alt=""></img></button>);
      })
      .catch(error => {
        console.error('Chyba při získávání dat:', error);
      });
  }, [searchedCity, user, usersData.users]);


  useEffect(() => {
    const historyApiUrl = `${historyApi}latitude=${lat}&longitude=${long}${historyApiSet}start_date=${dSevenYear}-${dSevenMonth}-${dSevenDay}&end_date=${dOneYear}-${dOneMonth}-${dOneDay}`
    fetch(historyApiUrl)
      .then(historyResponse => {
        if (!historyResponse.ok) {
          throw new Error('Network response was not ok');
        }
        return historyResponse.json();
      })
      .then(historyData => {
        setMaxTemp(historyData.daily.temperature_2m_max);
        setMinTemp(historyData.daily.temperature_2m_min);
        setPrecipitation(historyData.daily.precipitation_sum)
        setRain(historyData.daily.rain_sum)
        setShower(historyData.daily.showers_sum)
        setSnow(historyData.daily.snowfall_sum)
      })
      .catch(error => {
        console.error('Chyba při získávání dat:', error);
      });
  }, [long, lat, dOneDay, dOneMonth, dOneYear, dSevenDay, dSevenMonth, dSevenYear]);

  var table = <div className="history">
    <table className="historyTable" border="1">
      <thead>
        <tr>
          <th className="date">Datum</th>
          <th className="hiTemp">Max. teplota</th>
          <th className="loTemp">Min. teplota</th>
          <th className="rain">Srážky</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{dOneDay}.{dOneMonth}.{dOneYear}</td>
          <td>{maxTemp[6]} °C</td>
          <td>{minTemp[6]} °C</td>
          <td>{(precipitation[6] + rain[6] + shower[6] + snow[6]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{dTwoDay}.{dTwoMonth}.{dTwoYear}</td>
          <td>{maxTemp[5]} °C</td>
          <td>{minTemp[5]} °C</td>
          <td>{(precipitation[5] + rain[5] + shower[5] + snow[5]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{dThreeDay}.{dThreeMonth}.{dThreeYear}</td>
          <td>{maxTemp[4]} °C</td>
          <td>{minTemp[4]} °C</td>
          <td>{(precipitation[4] + rain[4] + shower[4] + snow[4]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{dFourDay}.{dFourMonth}.{dFourYear}</td>
          <td>{maxTemp[3]} °C</td>
          <td>{minTemp[3]} °C</td>
          <td>{(precipitation[3] + rain[3] + shower[3] + snow[3]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{dFiveDay}.{dFiveMonth}.{dFiveYear}</td>
          <td>{maxTemp[2]} °C</td>
          <td>{minTemp[2]} °C</td>
          <td>{(precipitation[2] + rain[2] + shower[2] + snow[2]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{dSixDay}.{dSixMonth}.{dSixYear}</td>
          <td>{maxTemp[1]} °C</td>
          <td>{minTemp[1]} °C</td>
          <td>{(precipitation[1] + rain[1] + shower[1] + snow[1]).toFixed(1)} mm</td>
        </tr>
        <tr>
          <td>{dSevenDay}.{dSevenMonth}.{dSevenYear}</td>
          <td>{maxTemp[0]} °C</td>
          <td>{minTemp[0]} °C</td>
          <td>{(precipitation[0] + rain[0] + shower[0] + snow[0]).toFixed(1)} mm</td>
        </tr>
      </tbody>
    </table>
  </div>


  if (user === "") {
    return (
      <div className="block">
        {head}
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
        {premium}
      </div>
    );
  }
  else {
    return (
      <div className="block">
        {head}
        <div className="search">
          <input type="text" placeholder="Zadejte město" onKeyDown={handleKeyDown}></input>
          <div className="favs">
            {favorites}
            {favoriteButton}
          </div>
        </div>
        <div className="weather">
          <h2 className="city">{userId} {city}</h2>
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
        {table}
      </div>
    );
  }
}

export default App;

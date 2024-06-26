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
import favoritePlus from './assets/favorite.png'
import favoriteMinus from './assets/favorite2.png'
import axios from 'axios';

var userName = "";
var passwordText = "";
var userId = "";
var helpCity = "";
var userFavs = [];

function App() {
  const usersData = require('./users.json')
  const [favorites, setFavorites] = useState("");

 // Nastavení hledaného města na oblíbené:
  const handleSelectChange = (event) => {
    const selectedCity = event.target.value;
    if (selectedCity !== "Oblíbené:") {
      setFavoritesButton(<button onClick={handleFavoriteButtonClickMinus}><img src={favoriteMinus} className="fav-icon" alt=""></img></button>);
      setSearchedCity(selectedCity);
      event.target.value = "Oblíbené:";
    }
  };

  // Registrace:
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
        await axios.post('https://stin-backend-apimanag.azure-api.net/api/Users', {
          username: usernameInput.value,
          password: passwordInput.value,
          pay: "no"
        });
        passwordText = passwordInput.value
        userName = username;
        setHead(payment);
        const selectElement = (
          <select onChange={handleSelectChange}>
            "Oblíbené:"
          </select>
        );
        setFavorites(selectElement)
        const response = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Users');
        const userData = response.data;
        const passwordMatch = userData.find(user => user.username === usernameInput.value && user.password === passwordInput.value)
        userId = passwordMatch.id
      } catch (error) {
        console.error('Chyba při vytváření uživatele:', error);
        alert('Došlo k chybě při vytváření uživatele. Zkuste to prosím znovu.');
      }
    };
  }

  // Přihlášení:
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
      userId = passwordMatch.id
      const response = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Favorites');
      const favorites = response.data;
      const userFavorites = favorites.filter(favorite => favorite.user_id === passwordMatch.id);
      for (let i = 0; i < userFavorites.length; i++) {
        if (userFavorites[i].city === helpCity) {
          setFavoritesButton(<button onClick={handleFavoriteButtonClickMinus}><img src={favoriteMinus} className="fav-icon" alt=""></img></button>)
        }
        userFavs.push(userFavorites[i].city)
      }
      const cityNames = ["Oblíbené:", ...userFavorites.map(item => item.city)];
      const selectOptions = cityNames.map(cityName => <option key={cityName}>{cityName}</option>);
      const selectElement = (
        <select onChange={handleSelectChange}>
          {selectOptions}
        </select>
      );
      setFavorites(selectElement);
    }
    else if (userExists && passwordMatch) {
      userName = username;
      passwordText = passwordInput.value;
      userId = passwordMatch.id
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

  // Ohlášení:
  const handleLogout = () => {
    setFavoritesButton(<button onClick={handleFavoriteButtonClickPlus}><img src={favoritePlus} className="fav-icon" alt=""></img></button>)
    userName = ""
    userFavs.splice(0, userFavs.length);
    console.log(userFavs)
    setUser("")
    const selectElement = (
      <select onChange={handleSelectChange}>
        "Oblíbené:"
      </select>
    );
    setFavorites(selectElement)
    setHead(login)
  }

  // Platba:
  const handlePayment = async () => {
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
      setUser("valid");
      const response = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Users');
      const userData = response.data;
      const userExists = userData.find(user => user.username === userName);
      try {
        await axios.put(`https://stin-backend-apimanag.azure-api.net/api/Users/${userExists.id}`, {
          id: userExists.id,
          username: userName,
          password: passwordText,
          pay: "yes"
        });
      } catch (error) {
        console.error('Chyba při vytváření uživatele:', error);
      }
      const response2 = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Favorites');
      const favorites = response2.data;
      const userFavorites = favorites.filter(favorite => favorite.user_id === userId);
      const cityNames = ["Oblíbené:", ...userFavorites.map(item => item.city)];
      const selectOptions = cityNames.map(cityName => <option key={cityName}>{cityName}</option>);
      const selectElement = (
        <select onChange={handleSelectChange}>
          {selectOptions}
        </select>
      );
      setFavorites(selectElement);
      setHead(logout)
    }
  }

  // HTML loginu:
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

  // HTML platby:
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

  const [favoritesButton, setFavoritesButton] = useState("")

  // Přidání oblíbeného města:
  const handleFavoriteButtonClickPlus = async () => {
    setFavoritesButton(<button onClick={handleFavoriteButtonClickMinus}><img src={favoriteMinus} className="fav-icon" alt=""></img></button>);
    try {
      const response = await axios.post('https://stin-backend-apimanag.azure-api.net/api/Favorites', {
        city: helpCity,
        user_id: userId
      });
      console.log(response.data);
      userFavs.push(helpCity);
      const selectOptions = ["Oblíbené:", ...userFavs].map(cityName => <option key={cityName}>{cityName}</option>);
      const selectElement = (
        <select onChange={handleSelectChange}>
          {selectOptions}
        </select>
      );
      setFavorites(selectElement);
    } catch (error) {
      console.error('Chyba při přidávání oblíbeného města:', error);
    }
  };

  // Odebrání oblíbeného města:
  const handleFavoriteButtonClickMinus = async () => {
    setFavoritesButton(<button onClick={handleFavoriteButtonClickPlus}><img src={favoritePlus} className="fav-icon" alt=""></img></button>)
    try {
      const response = await axios.get('https://stin-backend-apimanag.azure-api.net/api/Favorites');
      const favoriteToModify = response.data.find(favorite => favorite.city === helpCity && favorite.user_id === userId);
      if (favoriteToModify) {
        const favoriteId = favoriteToModify.id;
        await axios.delete(`https://stin-backend-apimanag.azure-api.net/api/Favorites/${favoriteId}`);
        const index = userFavs.indexOf(helpCity);
        if (index !== -1) {
          userFavs.splice(index, 1);
        }
        const selectOptions = ["Oblíbené:", ...userFavs].map(cityName => <option key={cityName}>{cityName}</option>);
        const selectElement = (
          <select onChange={handleSelectChange}>
            {selectOptions}
          </select>
        );
        setFavorites(selectElement);
      } else {
        console.log('Záznam nebyl nalezen.');
      }
    } catch (error) {
      console.error('Chyba při odebírání oblíbeného města:', error);
    }
  };

  // HTML popisu premium verze:
  const premium = (
    <div className="bot">
      *Prémiovými službami se rozumí zobrazení historie počasí 7 dní zpátky a možnost ukládat si oblíbená místa. Při registraci je vyžadován jednorázový poplatek 99 Kč.
    </div>
  );

  // HTML logoutu:
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

  // Spouštění vyhledávání zadaného města:
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchedCity(event.target.value);
      event.target.value = "";
    }
  };

  // Nastavení ikony počasí:
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

  //Volání api pro získání aktuálního počasí:
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiUrl = `https://stin-backend-apimanag.azure-api.net/api/Weather/GetWeather?searchedCity=${searchedCity}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTemperature(data.main.temp.toFixed(1) + " °C");
        setHumidity(data.main.humidity + " %");
        setWind(data.wind.speed.toFixed(1) + " km/h");
        setCity(data.name);
        helpCity = data.name
        setWeatherStatus(data.weather[0].icon);
        setLong(data.coord.lon);
        setLat(data.coord.lat);
        if (userFavs.includes(data.name)) {
          setFavoritesButton(
            <button onClick={handleFavoriteButtonClickMinus}>
              <img src={favoriteMinus} className="fav-icon" alt="minus" />
            </button>
          );
        } else {
          setFavoritesButton(
            <button onClick={handleFavoriteButtonClickPlus}>
              <img src={favoritePlus} className="fav-icon" alt="plus" />
            </button>
          );
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchWeatherData();
  }, [searchedCity, usersData.users, userFavs]);

  //Volání api pro získání historie počasí:
  useEffect(() => {
    const fetchWeatherHistory = async () => {
      const historyApiUrl = `https://stin-backend-apimanag.azure-api.net/api/Weather/GetWeatherHistory?latitude=${lat}&longitude=${long}&startYear=${dSevenYear}&startMonth=${dSevenMonth}&startDay=${dSevenDay}&endYear=${dOneYear}&endMonth=${dOneMonth}&endDay=${dOneDay}`;
      try {
        const historyResponse = await fetch(historyApiUrl);
        if (!historyResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const historyData = await historyResponse.json();
        setMaxTemp(historyData.daily.temperature_2m_max);
        setMinTemp(historyData.daily.temperature_2m_min);
        setPrecipitation(historyData.daily.precipitation_sum);
        setRain(historyData.daily.rain_sum);
        setShower(historyData.daily.showers_sum);
        setSnow(historyData.daily.snowfall_sum);
      } catch (error) {
        console.error('Chyba při získávání dat:', error);
      }
    };
    fetchWeatherHistory();
  }, [long, lat, dOneDay, dOneMonth, dOneYear, dSevenDay, dSevenMonth, dSevenYear]);

  // HTML tabulky s historií počasí:
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

  // Hlavní HTML podle validace uživatele:
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
          </div>
        </div>
        <div className="weather">
          <h2 className="city">{city} {favoritesButton}</h2>
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

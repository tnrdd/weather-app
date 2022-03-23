import "./styles/style.css";
import { fetchCoordinates, fetchWeather } from "./app.js";

const toggleUnits = document.querySelector("input[name=degrees]");
const search = document.querySelector("input[name=search]");
const searchIcon = document.querySelector("#search-icon");
const searchResults = document.querySelector("#search-results");
const current = document.querySelector("#current");
const forecast = document.querySelector("#daily");
let units = "metric";

function clearNode(node) {
  while (node.firstChild) {
    node.firstChild.remove();
  }
}

async function searchCity(city) {
  const cities = await fetchCoordinates(city);
  search.classList.add("dropdown");
  searchIcon.classList.add("dropdown");

  for (const i in cities) {
    const option = document.createElement("option");
    option.textContent = `${cities[i].name}, ${cities[i].state} ${cities[i].country}`;
    option.id = i;
    searchResults.appendChild(option);
  }

  searchResults.style.display = "block";
  getWeather(cities);
}

function getWeather(cities) {
  const options = document.querySelectorAll("option");
  const weather = {};
  const forecast = [];

  for (const option of options) {
    option.addEventListener("click", async (e) => {
      const rawWeather = await fetchWeather(
        cities[Number(e.target.id)].lat,
        cities[Number(e.target.id)].lon,
        units
      );

      weather.temp = Math.round(rawWeather.current.temp);
      weather.date = rawWeather.current.dt;
      weather.icon = rawWeather.current.weather[0].icon;
      weather.condition = rawWeather.current.weather[0].main;
      weather.description = rawWeather.current.weather[0].description;
      weather.humidity = Math.round(rawWeather.current.humidity);
      forecast[0] = rawWeather.daily;
      clearNode(searchResults);
      search.classList.remove("dropdown");
      searchIcon.classList.remove("dropdown");
      renderWeather(weather, forecast);
      searchResults.style.display = "none";
    });
  }
}

async function renderWeather(weather, forecast) {
  const date = document.createElement("p");
  const condition = document.createElement("img");
  const temp = document.createElement("p");
  const description = document.createElement("p");

  clearNode(current);
  clearNode(daily);

  if (weather.condition == "Clouds") {
    document.body.className = "cloud";
  } else if (weather.condition == "Rain") {
    document.body.className = "rain";
  } else if (weather.condition == "Snow") {
    document.body.className = "snow";
  } else if (weather.condition == "Mist") {
    document.body.className = "mist";
  } else if (weather.condition == "Clear") {
    document.body.className = "clear";
  }

  date.textContent = new Date(weather.date * 1000).toString().slice(0, 10);
  condition.src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  temp.textContent = `${weather.temp}\u00B0`;
  description.textContent = weather.description;

  current.appendChild(date);
  current.appendChild(condition);
  current.appendChild(temp);
  current.appendChild(description);

  for (const key in forecast[0]) {
    const day = document.createElement("div");
    const temp = document.createElement("p");
    const condition = document.createElement("img");
    const date = document.createElement("p");

    day.id = "day";
    date.textContent = new Date(forecast[0][key].dt * 1000)
      .toString()
      .slice(0, 3);
    temp.textContent = `${Math.round(forecast[0][key].temp.day)}\u00B0`;
    condition.src = `http://openweathermap.org/img/wn/${forecast[0][key].weather[0].icon}@2x.png`;
    day.appendChild(date);
    day.appendChild(condition);
    day.appendChild(temp);
    daily.appendChild(day);
  }
}

toggleUnits.addEventListener("click", (e) => {
  if (units == "metric") {
    units = "imperial";
  } else {
    units = "metric";
  }
});

search.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    clearNode(searchResults);
    if (search.value) {
      searchCity(e.target.value);
    } else {
      search.classList.remove("dropdown");
      searchIcon.classList.remove("dropdown");
      searchResults.style.display = "none";
    }
  }
});

searchIcon.addEventListener("click", (e) => {
  e.preventDefault();
  clearNode(searchResults);
  if (search.value) {
    searchCity(search.value);
  } else {
    search.classList.remove("dropdown");
    searchIcon.classList.remove("dropdown");
    searchResults.style.display = "none";
  }
});

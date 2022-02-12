import "./styles/style.css";
import { fetchCoordinates, fetchWeather } from "./app.js";

const weather = {};
const search = document.querySelector("input[name=search]");
const searchResults = document.querySelector("#search-results");
const current = document.querySelector("#current");

function clearNode(node) {
  while (node.firstChild) {
    node.firstChild.remove();
  }
}

search.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    clearNode(searchResults);
    searchCity(e.target.value);
  }
});

async function searchCity(city) {
  const cities = await fetchCoordinates(city);
  for (const i in cities) {
    const option = document.createElement("option");
    option.textContent = `${cities[i].name}, ${cities[i].state} ${cities[i].country}`;
    option.id = i;
    searchResults.appendChild(option);
  }
  const options = document.querySelectorAll("option");
  for (const option of options) {
    option.addEventListener("click", async (e) => {
      const rawWeather = await fetchWeather(
        cities[Number(e.target.id)].lat,
        cities[Number(e.target.id)].lon
      );
      weather.temp = rawWeather.main.temp;
      weather.max = rawWeather.main.temp_max;
      weather.min = rawWeather.main.temp_min;
      weather.humidity = rawWeather.main.humidity;
      console.log(weather);
      clearNode(searchResults);
      console.log(cities);
			renderWeather();
    });
  }
}

async function renderWeather() {
  clearNode(current);
  for (const key in weather) {
    const p = document.createElement("p");
    const h4 = document.createElement("h4");
    p.textContent = `${key}`;
    h4.textContent = `${weather[key]}`;
    current.appendChild(p);
    current.appendChild(h4);
  }
}

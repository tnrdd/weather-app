const APIKEY = "b1786abd94cb58614f13917da152e15a";

async function fetchCoordinates(city) {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKEY}`,
    { mode: "cors" }
  );
  const body = await response.json();
	return body
}

async function fetchWeather(lat, lon) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`,
    { mode: "cors" }
  );
  const body = await response.json();
	return body;
}

export { fetchCoordinates, fetchWeather };

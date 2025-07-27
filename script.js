const apiKey = "ab3f16e31d80e0dc668e0399aa6deb7b";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weather-icon");
const toggleBtn = document.getElementById("toggle-unit");

let currentUnit = "imperial"; // Default Fahrenheit
let lastLocation = ""; // Save last searched location
let lastData = null;   // Store last weather data

searchBtn.addEventListener("click", () => {
  const location = cityInput.value.trim();
  if (location) {
    lastLocation = location;
    getWeather(location);
  }
});

toggleBtn.addEventListener("click", () => {
  if (!lastData) return;
  if (currentUnit === "imperial") {
    currentUnit = "metric";
    toggleBtn.textContent = "Switch to °F";
    temperature.textContent = `${Math.round((lastData.main.temp - 32) * (5 / 9))} °C`;
  } else {
    currentUnit = "imperial";
    toggleBtn.textContent = "Switch to °C";
    temperature.textContent = `${Math.round(lastData.main.temp)} °F`;
  }
});

async function getWeather(location) {
  let query;

  if (/^\d+$/.test(location)) {
    query = `zip=${location},US`;
  } else if (location.includes(",")) {
    const [city, state] = location.split(",").map(s => s.trim());
    query = `q=${city},${state},US`;
  } else {
    query = `q=${location},US`;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=${currentUnit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod !== 200) throw new Error(data.message);
    lastData = data;
    displayWeather(data);
  } catch (error) {
    cityName.textContent = "Location not found";
    temperature.textContent = "--";
    description.textContent = error.message;
    weatherIcon.src = "";
  }
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)} ${currentUnit === "imperial" ? "°F" : "°C"}`;
  description.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

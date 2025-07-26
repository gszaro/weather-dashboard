const apiKey = "ab3f16e31d80e0dc668e0399aa6deb7b";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weather-icon");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(location) {
  let query;

  // If input is all numbers, treat it as ZIP
  if (/^\d+$/.test(location)) {
    query = `zip=${location},US`;
  } else {
    // For city or city,state, do not force add US unless user specifies
    query = `q=${location}`;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    cityName.textContent = "Location not found";
    temperature.textContent = "--";
    description.textContent = "Please try again";
    weatherIcon.src = "";
  }
}



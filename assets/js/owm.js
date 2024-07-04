const input = document.querySelector("#input");
const city = document.querySelector("#search-input");
const forecast = document.querySelector("#forecast");
const cityName = document.querySelector("#cityName");
const temp = document.querySelector("#temp");
const main = document.querySelector("#main");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const image = document.querySelector("#image");
let calendar;

// Perform your search functionality using the searchValue
input.onsubmit = async (e) => {
  e.preventDefault();
  updateWeatherData(await fetchWeather(city.value));
  updateForecastCalendar(await fetchForecast(city.value));
};

// Fetch the weather data for the given city
async function fetchWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1e4163859e4c095643dce57ff89370dd`
  );
  const data = await response.json();
  return data;
}

// Fetch the forecast data for the given city
async function fetchForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1e4163859e4c095643dce57ff89370dd&units=imperial`
  );
  const data = await response.json();
  return data;
}

// Update the weather data on the page
async function updateWeatherData(weatherData) {
  const cityNameElement = document.getElementById("cityName");
  const tempElement = document.getElementById("temp");
  const mainElement = document.getElementById("main");
  const descriptionElement = document.getElementById("description");
  const humidityElement = document.getElementById("humidity");
  const windElement = document.getElementById("wind");

  cityNameElement.innerHTML = weatherData.name;
  tempElement.innerHTML = `${Math.round(weatherData.main.temp)}°F`;
  mainElement.innerHTML = weatherData.weather[0].main;
  descriptionElement.innerHTML = weatherData.weather[0].description;
  humidityElement.innerHTML = `${weatherData.main.humidity}%`;
  windElement.innerHTML = `${weatherData.wind.speed} mph`;

  return weatherData;
}

// Update the forecast calendar
function updateForecastCalendar(forecastData) {
  // Clear any existing forecast events from the calendar
  calendar.removeAllEvents();
  forecastData.list.forEach((forecastHour) => {
    calendar.addEvent({
      title: `${forecastHour.weather[0].description} (${forecastHour.main.temp}°F)`,
      start: forecastHour.dt_txt,
      end: forecastHour.dt_txt,
    });
  });
}

// Initialize the calendar and render the initial city
document.addEventListener("DOMContentLoaded", function () {
  let calendarEl = document.getElementById("forecast-calendar");
  calendarEl.style.height = "100%";
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: [], // Initialize an empty array to store the forecast events
  });

  calendar.render();

  // Fetch the forecast data and populate the calendar events
  fetchForecast(city.value)
    .then((data) => {
      data.list.forEach((forecastHour) => {
        const event = {
          title: `${forecastHour.weather[0].description} (${forecastHour.main.temp}°F)`,
          start: forecastHour.dt_txt,
          end: forecastHour.dt_txt,
        };
        calendar.addEvent(event);
      });
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
});

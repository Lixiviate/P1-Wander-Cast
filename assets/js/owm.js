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
function updateWeatherData(weatherData) {
  cityName.innerHTML = weatherData.name;
  temp.innerHTML = `${Math.round(weatherData.main.temp)}°F`;
  main.innerHTML = weatherData.weather[0].main;
  description.innerHTML = weatherData.weather[0].description;
  humidity.innerHTML = `${weatherData.main.humidity}%`;
  wind.innerHTML = `${weatherData.wind.speed} mph`;
  image.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
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

// Initialize the calendar
document.addEventListener("DOMContentLoaded", function () {
  let calendarEl = document.getElementById("forecast-calendar");
  calendarEl.style.height = "100%";
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridDay",
    views: {
      dayGridDay: { buttonText: 'Day' },
      listWeek: { buttonText: 'Week' }
    },
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "listWeek,dayGridDay",
    },
    events: [], // Initialize an empty array to store the forecast events
  });

  calendar.render();
});
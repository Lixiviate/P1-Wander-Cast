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

  // Perform your search functionality using the searchValue

input.onsubmit = (e) => {
    e.preventDefault();
    weatherUpdate(city.value);
};

function weatherUpdate(city) {
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1e4163859e4c095643dce57ff89370dd`
    );

    xhr.send();
    xhr.onload = () => {
        if (xhr.status === 404) {
            alert("City not found");
        } else {
            var data = JSON.parse(xhr.response);
            cityName.innerHTML = data.name;
            temp.innerHTML = `${Math.round(data.main.temp)}°F`;
            main.innerHTML = data.weather[0].main;
            description.innerHTML = data.weather[0].description;
            humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
            wind.innerHTML = `Wind Speed: ${data.wind.speed} mph`;

            image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        }
    };
}

// Get the city name from the search input field
const cityame = document.getElementById('search-input').value;

// Fetch the weather data for the given city
async function fetchWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=1e4163859e4c095643dce57ff89370dd`);
  const data = await response.json();
  return data;
}

// Fetch the forecast data for the given city
async function fetchForecast(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1e4163859e4c095643dce57ff89370dd&units=imperial`);
  const data = await response.json();
  return data;
}

// Update the weather data on the page
async function updateWeatherData(weatherData) {
  const cityNameElement = document.getElementById('cityName');
  const tempElement = document.getElementById('temp');
  const mainElement = document.getElementById('main');
  const descriptionElement = document.getElementById('description');
  const humidityElement = document.getElementById('humidity');
  const windElement = document.getElementById('wind');

  cityNameElement.innerHTML = weatherData.name;
  tempElement.innerHTML = `${Math.round(weatherData.main.temp)}°F`;
  mainElement.innerHTML = weatherData.weather[0].main;
  descriptionElement.innerHTML = weatherData.weather[0].description;
  humidityElement.innerHTML = `Humidity: ${weatherData.main.humidity}%`;
  windElement.innerHTML = `Wind Speed: ${weatherData.wind.speed} mph`;

  return weatherData;
}

// Search for a city and center the map on it
async function searchCity(event) {
  event.preventDefault();
  const city = document.getElementById(`${city}`).value;
  const weatherData = await fetchWeather(city);
  const forecastData = await fetchForecast(city);

  // Update weather data
  const updatedWeatherData = updateWeatherData(weatherData);
  cityNameElement.innerHTML = updatedWeatherData.city;
  tempElement.innerHTML = `${Math.round(updatedWeatherData.temperature)}°F`;
  mainElement.innerHTML = updatedWeatherData.main;
  descriptionElement.innerHTML = updatedWeatherData.description;
  humidityElement.innerHTML = `Humidity: ${updatedWeatherData.humidity}%`;
  windElement.innerHTML = `Wind Speed: ${weatherData.wind.speed} mph`;

  // Clear any existing forecast events from the calendar
  calendar.getEvents().forEach(event => {
    calendar.removeEvent(event);
  });

  // Fetch the forecast data and populate the calendar events
  fetchForecast(`${city}`)
    .then(data => {
      data.list.forEach(forecastHour => {
        const event = {
          title: `${forecastHour.weather[0].description} (${forecastHour.main.temp}°F)`,
          start: forecastHour.dt_txt,
          end: forecastHour.dt_txt
        };
        calendar.addEvent(event);
      });
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
}

// Initialize the calendar and render the initial city
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('forecast-calendar');
  calendarEl.style.height = '100%';
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [] // Initialize an empty array to store the forecast events
  });

  calendar.render();

  // Fetch the forecast data and populate the calendar events
  fetchForecast('New York')
    .then(data => {
      data.list.forEach(forecastHour => {
        const event = {
          title: `${forecastHour.weather[0].description} (${forecastHour.main.temp}°F)`,
          start: forecastHour.dt_txt,
          end: forecastHour.dt_txt
        };
        calendar.addEvent(event);
      });
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
});

// Call the searchCity function with the initial city
searchCity(null);
weatherUpdate("New York");
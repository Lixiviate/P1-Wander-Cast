const input = document.querySelector("#input");
const city = document.querySelector("#search-input");
const forecast = document.querySelector("#forecast");
const cityName = document.querySelector("#cityName");
const temp = document.querySelector("#temp");
const main = document.querySelector("#main");
const description = document.querySelector("#description");

// Get the input element with id="city"

// Get the input element with id="search-input"


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
            image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        }
    };
}

async function fetchForecast(city) {
    const apiKey = '32a0fbde3983d32c83bd4911eb57811a';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`
        );
        const data = await response.json();
        return data;
}

// ...

async function searchCity(event) {
    event.preventDefault();
    const city = city.value;
    const weatherData = await fetchWeather(city);
    const forecastData = await fetchForecast(city);

    // Update weather data
    const updatedWeatherData = updateWeatherData(weatherData);
    cityName.innerHTML = updatedWeatherData.city;
    temp.innerHTML = `${Math.round(updatedWeatherData.temperature)}°F`;
    main.innerHTML = updatedWeatherData.main;
    description.innerHTML = updatedWeatherData.description;

    // Update forecast data
    const forecastCalendar = document.getElementById('forecast-calendar');
    forecastCalendar.innerHTML = '';
    for (let i = 0; i < forecastData.list.length; i += 8) {
        const forecastDay = forecastData.list[i];
        const forecastBox = document.createElement('div');
        forecastBox.classList.add('column', 'is-one-quarter');
        const forecastDayTemplate = document.getElementById('forecast-day-template');
        const clonedForecastDayTemplate = forecastDayTemplate.cloneNode(true);
        clonedForecastDayTemplate.querySelector('.title').textContent = `Day ${i / 8 + 1}`;
        clonedForecastDayTemplate.querySelector('img').src = `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`;
        clonedForecastDayTemplate.querySelector('#forecast-temp').textContent = `${forecastDay.main.temp}°C`;
        clonedForecastDayTemplate.querySelector('#forecast-description').textContent = forecastDay.weather[0].description;
        forecastCalendar.appendChild(clonedForecastDayTemplate);

        // Add forecast day as an event in the FullCalendar component
        const event = {
            title: `Day ${i / 8 + 1}`,
            start: forecastDay.dt_txt,
            end: forecastDay.dt_txt,
            backgroundColor: '#3788ee',
            borderColor: '#3788ee'
        };
        calendar.addEvent(event);
    }
}

// ...



// Call the searchCity function with the initial city
searchCity(null);

weatherUpdate("New York");

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('forecast-calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
          // Add forecast data as events here
        ]
    });

    calendar.render();
});
const input = document.querySelector("#input");
const city = document.querySelector("#search-input");

const cityName = document.querySelector("#cityName");
const temp = document.querySelector("#temp");
const main = document.querySelector("#main");
const description = document.querySelector("#description");

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

// Call the weatherUpdate function with a default city name
weatherUpdate("New York");
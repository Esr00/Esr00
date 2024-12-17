// Weather API key
const apiKey = "80469d9857ce4de1b52115950241712";
const apiUrl = "https://api.weatherapi.com/v1/forecast.json";

// Select elements
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("submit");
const forecastContainer = document.querySelector(".card-group");

// Icon mapping for weather conditions
const weatherIcons = {
    morning: "morning.webp",
    evening: "evening.webp",
    sunny: "sunny.webp",
    clear: "images/clear.png",
    cloudy:"cloudy.webp",
    rain: "176.webp",
    snow: "snow.webp",
    mist: "mist.webp",  
};

searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name!");
    }
});

function fetchWeather(city) {
    const url = `${apiUrl}?key=${apiKey}&q=${city}&days=3`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found!");
            }
            return response.json();
        })
        .then((data) => {
            displayForecast(data);
        })
        .catch((error) => {
            alert(error.message);
        });
}

function displayForecast(data) {
    const { forecast } = data;

    // Clear previous forecast
    forecastContainer.innerHTML = "";

    forecast.forecastday.forEach((day, index) => {
        const { date, day: dayInfo } = day;
        const { avgtemp_c, condition } = dayInfo;

        let iconPath;

        if (index === 0) {
            // First card: Morning or Evening icon
            const currentHour = new Date().getHours();
            iconPath = currentHour < 18 ? weatherIcons.morning : weatherIcons.evening;
        } else {
            // Other cards: Weather condition icon
            const weatherCondition = condition.text.toLowerCase();
            iconPath = weatherIcons.sunny; // Default icon

            if (weatherCondition.includes("clear")) {
                iconPath = weatherIcons.clear;
            } else if (weatherCondition.includes("cloud")) {
                iconPath = weatherIcons.cloudy;
            } else if (weatherCondition.includes("rain")) {
                iconPath = weatherIcons.rain;
            } else if (weatherCondition.includes("snow")) {
                iconPath = weatherIcons.snow;
            } else if (weatherCondition.includes("mist")) {
                iconPath = weatherIcons.mist;
            }
        }

        const forecastCard = `
        <div class="card" id="card-b">
            <div class="forecast-header text-center text-secondary">
                <div class="day">${new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                })}</div>
                <div class="date">${new Date(date).toLocaleDateString()}</div>
            </div>
            <div class="forecast-content text-light text-center">
                <div class="forecast-icon">
                    <img src="${iconPath}" alt="${condition.text}" width="48">
                </div>
                <div class="degree fs-3 fw-bold">${avgtemp_c}<sup>o</sup>C</div>
                <div class="custom text-info">${condition.text}</div>
            </div>
        </div>`;
        
        forecastContainer.innerHTML += forecastCard;
    });
}

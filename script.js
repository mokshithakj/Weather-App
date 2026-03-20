const API_KEY = "c516ad74d0bd414298d70800262003";

// Manual search
async function getWeather() {
    const location = document.getElementById("locationInput").value;

    if (!location) {
        alert("Enter a city");
        return;
    }

    fetchWeather(location);
}

// GPS location
function getUserLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(`${lat},${lon}`);
        },
        () => {
            alert("Permission denied");
        }
    );
}

// Fetch weather + 5-day forecast
async function fetchWeather(query) {
    const resultDiv = document.getElementById("weatherResult");
    resultDiv.innerHTML = "Loading...";

    try {
        const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=5&aqi=yes`
        );

        const data = await res.json();

        if (data.error) {
            resultDiv.innerHTML = data.error.message;
            return;
        }

        displayWeather(data);

    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = "Error fetching weather";
    }
}

// Display UI
function displayWeather(data) {
    const resultDiv = document.getElementById("weatherResult");

    let forecastHTML = "";

    data.forecast.forecastday.forEach(day => {
        forecastHTML += `
            <div class="day">
                <p>${day.date}</p>
                <img src="https:${day.day.condition.icon}">
                <p>${day.day.avgtemp_c}°C</p>
            </div>
        `;
    });

    resultDiv.innerHTML = `
        <h3>${data.location.name}, ${data.location.country}</h3>
        <h2>${data.current.temp_c}°C</h2>
        <p>${data.current.condition.text}</p>

        <div class="forecast">
            ${forecastHTML}
        </div>
    `;
}
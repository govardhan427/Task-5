const apiKey = 'Dm9Sv8zB5eM3SWYoC8gAW'; // Your client ID
const apiSecret = 'ZE9vtLkTpvQWBn3FR7Oj12HEfAzTddCi1BePLd0A'; // Your client secret

// Base URL for API requests
const apiUrl = 'https://data.api.xweather.com/conditions/:auto?format=json&plimit=1&filter=1min';

const weatherInfoDiv = document.getElementById('weather-info');
const locationForm = document.getElementById('location-form');
const locationInput = document.getElementById('location-input');
const getLocationBtn = document.getElementById('get-location-btn');

async function fetchWeather(lat = null, lon = null, city = null) {
    let url = apiUrl;

    if (lat !== null && lon !== null) {
        url = `${url}&lat=${lat}&lon=${lon}`;
    } else if (city !== null) {
        url = `${url}&q=${city}`;
    }

    url = `${url}&client_id=${apiKey}&client_secret=${apiSecret}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.success) {
            console.error('API response indicates failure:', data);
            weatherInfoDiv.innerHTML = '<p>Error fetching weather data.</p>';
            return;
        }

        const weather = data.response[0];
        displayWeather(weather);
    } catch (error) {
        console.error('Fetch error:', error);
        weatherInfoDiv.innerHTML = '<p>Error fetching weather data.</p>';
    }
}

function displayWeather(weather) {
    const { place, periods } = weather;
    const current = periods[0]; // Assuming we're interested in the first period

    weatherInfoDiv.innerHTML = `
        <h2>Weather in ${place.name}, ${place.country}</h2>
        <p><strong>Temperature:</strong> ${current.tempC}°C (${current.tempF}°F)</p>
        <p><strong>Feels Like:</strong> ${current.feelslikeC}°C (${current.feelslikeF}°F)</p>
        <p><strong>Humidity:</strong> ${current.humidity}%</p>
        <p><strong>Pressure:</strong> ${current.pressureMB} MB (${current.pressureIN} inHg)</p>
        <p><strong>Wind Speed:</strong> ${current.windSpeedKPH} km/h (${current.windSpeedMPH} mph)</p>
        <p><strong>Visibility:</strong> ${current.visibilityKM} km (${current.visibilityMI} miles)</p>
        <p><strong>Weather:</strong> ${current.weather}</p>
        <p><strong>Precipitation:</strong> ${current.precipMM} mm (${current.precipIN} in)</p>
        <img src="https://example.com/icons/${current.icon}" alt="${current.weather}" />
    `;
}

function handleLocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    fetchWeather(latitude, longitude);
}

function handleLocationError() {
    weatherInfoDiv.innerHTML = '<p>Unable to retrieve your location.</p>';
}

locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = locationInput.value.trim();
    if (city) {
        fetchWeather(null, null, city);
    }
});

getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
    } else {
        weatherInfoDiv.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
});

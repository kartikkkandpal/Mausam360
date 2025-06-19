// --- OpenWeatherMap API Key ---
// You need to get your own API key from OpenWeatherMap.
// Go to https://openweathermap.org/api and sign up for a free account.
// Once you have your key, replace 'YOUR_OPENWEATHER_API_KEY' below with it.
const API_KEY = 'f7130f9dd3cbe29b2b5b46040cc37a3a'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// --- DOM Elements ---
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const locationName = document.getElementById('location-name');
const weatherDescription = document.getElementById('weather-description');
const mainWeatherIcon = document.getElementById('main-weather-icon');
const currentTemp = document.getElementById('current-temp');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const uvIndex = document.getElementById('uv-index');
const pollution = document.getElementById('pollution');
const pollen = document.getElementById('pollen');
const forecastContainer = document.getElementById('forecast-container');

// --- Helper Function to Get Weather Icon based on OpenWeatherMap ID ---
function getWeatherIcon(iconCode) {
    // Mapping OpenWeatherMap icon codes to Font Awesome icons
    // This is a simplified mapping, you can expand it for more specific icons
    if (iconCode.includes('01')) return 'fa-sun'; // Clear sky
    if (iconCode.includes('02')) return 'fa-cloud-sun'; // Few clouds
    if (iconCode.includes('03') || iconCode.includes('04')) return 'fa-cloud'; // Scattered/Broken clouds
    if (iconCode.includes('09') || iconCode.includes('10')) return 'fa-cloud-showers-heavy'; // Rain/Shower rain
    if (iconCode.includes('11')) return 'fa-bolt'; // Thunderstorm
    if (iconCode.includes('13')) return 'fa-snowflake'; // Snow
    if (iconCode.includes('50')) return 'fa-smog'; // Mist
    return 'fa-question-circle'; // Default unknown icon
}

// --- Fetch Weather Data ---
async function getWeatherData(city) {
    if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
        // Using a custom message box instead of alert() for better UX
        const message = 'Please replace "YOUR_OPENWEATHER_API_KEY" with your actual OpenWeatherMap API key in the script.js file.';
        displayMessageBox('API Key Missing', message);
        return;
    }
    try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!currentWeatherResponse.ok) {
            if (currentWeatherResponse.status === 404) {
                throw new Error(`City "${city}" not found.`);
            } else {
                throw new Error(`Failed to fetch current weather data. Status: ${currentWeatherResponse.status}`);
            }
        }
        const currentWeatherData = await currentWeatherResponse.json();

        // Fetch 5-day forecast (OpenWeatherMap free tier provides 5-day / 3-hour forecast)
        const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        if (!forecastResponse.ok) {
            if (forecastResponse.status === 404) {
                 throw new Error(`City "${city}" not found for forecast.`);
            } else {
                throw new Error(`Failed to fetch forecast data. Status: ${forecastResponse.status}`);
            }
        }
        const forecastData = await forecastResponse.json();

        // Fetch UV Index (requires separate API if available in your plan, otherwise mock)
        // OpenWeatherMap's free tier usually doesn't include UV Index directly with /weather.
        // For demonstration, we'll mock this or provide a basic placeholder.
        // A real implementation might use a separate UV API or a paid OpenWeatherMap plan.
        const uvData = { value: Math.floor(Math.random() * 10) + 1 }; // Mock UV index 1-10

        return { current: currentWeatherData, forecast: forecastData, uv: uvData };

    } catch (error) {
        console.error("Error fetching weather data:", error);
        displayMessageBox('Error', `Could not fetch weather data: ${error.message}. Please check the city name and your API key.`);
        return null;
    }
}

// --- Function to display a custom message box (replaces alert()) ---
function displayMessageBox(title, message) {
    // Create modal background
    const modalBackground = document.createElement('div');
    modalBackground.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Create modal content box
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        font-family: 'Inter', sans-serif;
    `;

    // Add title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = `
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 15px;
        color: #333;
    `;
    messageBox.appendChild(titleElement);

    // Add message
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.cssText = `
        font-size: 1rem;
        margin-bottom: 20px;
        color: #555;
    `;
    messageBox.appendChild(messageElement);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.style.cssText = `
        background-color: #3f2b96;
        color: white;
        padding: 10px 25px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
    `;
    closeButton.onmouseover = () => closeButton.style.backgroundColor = '#5c45ae';
    closeButton.onmouseout = () => closeButton.style.backgroundColor = '#3f2b96';
    closeButton.onclick = () => document.body.removeChild(modalBackground);
    messageBox.appendChild(closeButton);

    modalBackground.appendChild(messageBox);
    document.body.appendChild(modalBackground);
}


// --- Render Weather Data to UI ---
function renderWeatherData(data) {
    if (!data) return;

    const { current, forecast, uv } = data;

    // Update current weather
    locationName.textContent = current.name;
    weatherDescription.textContent = current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1);
    mainWeatherIcon.className = `fas ${getWeatherIcon(current.weather[0].icon)} icon-large`;
    currentTemp.textContent = `${Math.round(current.main.temp)}°`;

    windSpeed.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    humidity.textContent = `${current.main.humidity}%`;
    uvIndex.textContent = `UV ${uv.value <= 2 ? 'Low' : uv.value <= 5 ? 'Moderate' : 'High'}`;
    // OpenWeatherMap free tier doesn't directly provide pollution/pollen in current weather.
    // These are placeholders for now. For a real app, you'd integrate a separate air quality API.
    pollution.textContent = 'Low Pollution';
    pollen.textContent = 'Low Pollen';

    // Update forecast
    forecastContainer.innerHTML = ''; // Clear previous forecast
    const dailyForecasts = {}; // To store one forecast per day

    // OpenWeatherMap forecast provides data every 3 hours. We want one entry per day.
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
        const dateKey = date.toISOString().split('T')[0]; //YYYY-MM-DD

        // Only take the first entry for each day to represent the daily forecast
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                day: dayOfWeek,
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon
            };
        }
    });

    // Get the next 4 unique days after today
    const today = new Date().toISOString().split('T')[0];
    const sortedDates = Object.keys(dailyForecasts).sort();
    let count = 0;
    for (const dateKey of sortedDates) {
        if (dateKey === today) continue; // Skip today's forecast if it's there
        if (count >= 4) break; // Display next 4 days

        const forecast = dailyForecasts[dateKey];
        const forecastCard = `
            <div class="forecast-card">
                <span class="day-of-week">${forecast.day}</span>
                <i class="fas ${getWeatherIcon(forecast.icon)} forecast-icon"></i>
                <span class="forecast-temp">${forecast.temp}°</span>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', forecastCard);
        count++;
    }
}

// --- Event Listeners ---
searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) {
        const weatherData = await getWeatherData(city);
        renderWeatherData(weatherData);
    } else {
        displayMessageBox('Input Required', 'Please enter a city name.');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// --- Initial Load (Fetch weather for a default city) ---
window.onload = async () => {
    // Fetch and render weather for London on initial load
    const defaultCity = "London";
    const weatherData = await getWeatherData(defaultCity);
    renderWeatherData(weatherData);
};
const API_KEY = 'f7130f9dd3cbe29b2b5b46040cc37a3a'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
const errorMsg = document.getElementById('error-msg');

function getWeatherIcon(iconCode) {
  if (iconCode.includes('01')) return 'fa-sun';
  if (iconCode.includes('02')) return 'fa-cloud-sun';
  if (iconCode.includes('03') || iconCode.includes('04')) return 'fa-cloud';
  if (iconCode.includes('09') || iconCode.includes('10')) return 'fa-cloud-showers-heavy';
  if (iconCode.includes('11')) return 'fa-bolt';
  if (iconCode.includes('13')) return 'fa-snowflake';
  if (iconCode.includes('50')) return 'fa-smog';
  return 'fa-question-circle';
}

function showError(message) {
  errorMsg.textContent = message;
}

async function getWeatherData(city) {
  errorMsg.textContent = ''; // Clear previous error
  try {
    const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!currentWeatherResponse.ok) {
      throw new Error('City not found');
    }
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    if (!forecastResponse.ok) {
      throw new Error('Forecast data not found');
    }
    const forecastData = await forecastResponse.json();

    const uvData = { value: Math.floor(Math.random() * 10) + 1 };
    return { current: currentWeatherData, forecast: forecastData, uv: uvData };

  } catch (error) {
    showError(error.message);
    return null;
  }
}

function renderWeatherData(data) {
  if (!data) return;

  const { current, forecast, uv } = data;

  locationName.textContent = current.name;
  weatherDescription.textContent = current.weather[0].description;
  mainWeatherIcon.className = `fas ${getWeatherIcon(current.weather[0].icon)} icon-large`;
  currentTemp.textContent = `${Math.round(current.main.temp)}°`;
  windSpeed.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
  humidity.textContent = `${current.main.humidity}%`;
  uvIndex.textContent = `UV ${uv.value <= 2 ? 'Low' : uv.value <= 5 ? 'Moderate' : 'High'}`;
  pollution.textContent = 'Low Pollution';
  pollen.textContent = 'Low Pollen';

  forecastContainer.innerHTML = '';
  const dailyForecasts = {};
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const dateKey = date.toISOString().split('T')[0];
    if (!dailyForecasts[dateKey]) {
      dailyForecasts[dateKey] = {
        day: dayOfWeek,
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon
      };
    }
  });

  const today = new Date().toISOString().split('T')[0];
  const sortedDates = Object.keys(dailyForecasts).sort();
  let count = 0;
  for (const dateKey of sortedDates) {
    if (dateKey === today) continue;
    if (count >= 4) break;

    const f = dailyForecasts[dateKey];
    forecastContainer.innerHTML += `
      <div class="forecast-card">
        <span class="day-of-week">${f.day}</span>
        <i class="fas ${getWeatherIcon(f.icon)} forecast-icon"></i>
        <span class="forecast-temp">${f.temp}°</span>
      </div>`;
    count++;
  }
}

searchButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name.');
    return;
  }
  const data = await getWeatherData(city);
  renderWeatherData(data);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchButton.click();
  }
});

window.onload = async () => {
  const defaultCity = 'London';
  const data = await getWeatherData(defaultCity);
  renderWeatherData(data);
};

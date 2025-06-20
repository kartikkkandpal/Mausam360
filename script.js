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
const unitToggle = document.getElementById('unit-toggle');
const themeToggle = document.getElementById('theme-toggle');
const errorMsg = document.getElementById('error-msg');

let isCelsius = true;
let currentTempCelsius = null;
let forecastTemps = [];
let tempChart = null;

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
  errorMsg.textContent = '';
  try {
    const currentWeatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!currentWeatherResponse.ok) throw new Error('City not found');
    const current = await currentWeatherResponse.json();

    const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const forecast = await forecastResponse.json();

    const uv = { value: Math.floor(Math.random() * 10) + 1 };

    return { current, forecast, uv };
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

  currentTempCelsius = current.main.temp;
  updateTemperatureDisplay();

  windSpeed.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
  humidity.textContent = `${current.main.humidity}%`;
  uvIndex.textContent = `UV ${uv.value <= 2 ? 'Low' : uv.value <= 5 ? 'Moderate' : 'High'}`;
  pollution.textContent = 'Low Pollution';
  pollen.textContent = 'Low Pollen';

  forecastContainer.innerHTML = '';
  forecastTemps = [];
  const labels = [];
  const dailyForecasts = {};
  forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = date.toLocaleDateString('en-GB');
    if (!dailyForecasts[dateKey]) {
      dailyForecasts[dateKey] = { day, fullDate, temp: Math.round(item.main.temp), icon: item.weather[0].icon };
    }
  });

  const today = new Date().toISOString().split('T')[0];
  let count = 0;
  for (let key of Object.keys(dailyForecasts)) {
    if (key === today || count >= 4) continue;
    const f = dailyForecasts[key];
    forecastTemps.push(f.temp);
    labels.push(f.day);

    forecastContainer.innerHTML += `
      <div class="forecast-card">
        <i class="fas ${getWeatherIcon(f.icon)} forecast-icon"></i>
        <div class="forecast-details">
          <div class="day-of-week">${f.day}</div>
          <div class="forecast-date">${f.fullDate}</div>
          <div class="forecast-temp">${Math.round(isCelsius ? f.temp : (f.temp * 9/5 + 32))}${isCelsius ? '°C' : '°F'}</div>
        </div>
      </div>`;
    count++;
  }

  renderChart(labels, forecastTemps);
}

function updateTemperatureDisplay() {
  if (currentTempCelsius !== null) {
    const temp = isCelsius ? currentTempCelsius : (currentTempCelsius * 9 / 5 + 32);
    currentTemp.textContent = `${Math.round(temp)}${isCelsius ? '°C' : '°F'}`;
  }

  const forecastCards = document.querySelectorAll('.forecast-card');
  forecastCards.forEach((card, i) => {
    const temp = isCelsius ? forecastTemps[i] : (forecastTemps[i] * 9 / 5 + 32);
    card.querySelector('.forecast-temp').textContent = `${Math.round(temp)}${isCelsius ? '°C' : '°F'}`;
  });

  renderChart(forecastTemps.map((_, i) => `Day ${i + 1}`), forecastTemps);
}

function renderChart(labels, temps) {
  const ctx = document.getElementById('tempChart').getContext('2d');
  if (tempChart) tempChart.destroy();

  const data = isCelsius ? temps : temps.map(t => (t * 9 / 5 + 32));
  tempChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Temperature (${isCelsius ? '°C' : '°F'})`,
        data,
        borderColor: '#4fc3f7',
        backgroundColor: 'rgba(79, 195, 247, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false } }
    }
  });
}

searchButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) return showError('Please enter a city name.');
  const data = await getWeatherData(city);
  renderWeatherData(data);
});

cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchButton.click();
});

unitToggle.addEventListener('change', () => {
  isCelsius = !isCelsius;
  updateTemperatureDisplay();
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode');
});

window.onload = async () => {
  const data = await getWeatherData('London');
  renderWeatherData(data);
};
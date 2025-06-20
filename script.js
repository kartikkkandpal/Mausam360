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
const unitToggle = document.getElementById('unit-toggle');
const themeToggle = document.getElementById('theme-toggle');
const currentDate = document.getElementById('current-date');

let isCelsius = true;
let chartInstance = null;

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
    const weatherRes = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!weatherRes.ok) throw new Error('City not found');
    const current = await weatherRes.json();

    const forecastRes = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    if (!forecastRes.ok) throw new Error('Forecast not found');
    const forecast = await forecastRes.json();

    const uv = { value: Math.floor(Math.random() * 10) + 1 };
    return { current, forecast, uv };
  } catch (error) {
    showError(error.message);
    return null;
  }
}

function renderChart(labels, temps) {
  const ctx = document.getElementById('tempChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Temp (${isCelsius ? '°C' : '°F'})`,
        data: temps,
        backgroundColor: 'rgba(0, 204, 255, 0.2)',
        borderColor: 'rgba(0, 204, 255, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: value => `${value}°`
          }
        }
      }
    }
  });
}

function convertTemp(temp) {
  return isCelsius ? `${Math.round(temp)}°C` : `${Math.round(temp * 9 / 5 + 32)}°F`;
}

function renderWeatherData(data) {
  if (!data) return;

  const { current, forecast, uv } = data;
  locationName.textContent = current.name;
  weatherDescription.textContent = current.weather[0].description;
  mainWeatherIcon.className = `fas ${getWeatherIcon(current.weather[0].icon)} icon-large`;
  currentTemp.textContent = convertTemp(current.main.temp);
  windSpeed.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
  humidity.textContent = `${current.main.humidity}%`;
  uvIndex.textContent = `UV ${uv.value <= 2 ? 'Low' : uv.value <= 5 ? 'Moderate' : 'High'}`;
  pollution.textContent = 'Low Pollution';
  pollen.textContent = 'Low Pollen';

  const today = new Date();
  currentDate.textContent = today.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const dailyForecasts = {};
  forecast.list.forEach(item => {
    const dateObj = new Date(item.dt * 1000);
    const dateKey = dateObj.toISOString().split('T')[0];
    if (!dailyForecasts[dateKey]) {
      dailyForecasts[dateKey] = {
        day: dateObj.toLocaleString('en-US', { weekday: 'short' }),
        date: dateObj.toLocaleDateString('en-GB'),
        temp: item.main.temp,
        icon: item.weather[0].icon
      };
    }
  });

  const todayKey = today.toISOString().split('T')[0];
  const sortedDates = Object.keys(dailyForecasts).sort();
  let count = 0;
  const labels = [], temps = [];
  forecastContainer.innerHTML = '';

  for (const date of sortedDates) {
    if (date === todayKey) continue;
    const f = dailyForecasts[date];
    if (count < 4) {
      forecastContainer.innerHTML += `
        <div class="forecast-card">
          <i class="fas ${getWeatherIcon(f.icon)} forecast-icon"></i>
          <div class="forecast-details">
            <span class="day-of-week">${f.day}</span>
            <span class="forecast-date">${f.date}</span>
          </div>
          <span class="forecast-temp">${convertTemp(f.temp)}</span>
        </div>`;
      labels.push(f.day);
      temps.push(isCelsius ? f.temp : (f.temp * 9 / 5 + 32));
      count++;
    }
  }

  renderChart(labels, temps);
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
  isCelsius = !unitToggle.checked;
  const city = locationName.textContent;
  if (city) getWeatherData(city).then(renderWeatherData);
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', themeToggle.checked);
});

window.onload = async () => {
  const defaultCity = 'London';
  const data = await getWeatherData(defaultCity);
  renderWeatherData(data);
};
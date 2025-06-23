const API_KEY = 'f7130f9dd3cbe29b2b5b46040cc37a3a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const locateButton = document.getElementById('locate-button');
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

// State
let isCelsius = true;
let chartInstance = null;

// Weather icon mapping
function getWeatherIcon(iconCode) {
  const iconMap = {
    '01d': 'fa-sun', '01n': 'fa-moon',
    '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
    '03d': 'fa-cloud', '03n': 'fa-cloud',
    '04d': 'fa-cloud', '04n': 'fa-cloud',
    '09d': 'fa-cloud-showers-heavy', '09n': 'fa-cloud-showers-heavy',
    '10d': 'fa-cloud-rain', '10n': 'fa-cloud-rain',
    '11d': 'fa-bolt', '11n': 'fa-bolt',
    '13d': 'fa-snowflake', '13n': 'fa-snowflake',
    '50d': 'fa-smog', '50n': 'fa-smog'
  };
  return iconMap[iconCode] || 'fa-question-circle';
}

// Error display
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
  setTimeout(() => {
    errorMsg.style.display = 'none';
  }, 5000);
}

// Fetch weather by city name
async function getWeatherData(city) {
  errorMsg.style.display = 'none';
  try {
    const weatherResponse = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!weatherResponse.ok) throw new Error('City not found');
    const currentWeather = await weatherResponse.json();

    const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    if (!forecastResponse.ok) throw new Error('Forecast data not available');
    const forecastData = await forecastResponse.json();

    return {
      current: currentWeather,
      forecast: forecastData,
      uv: { value: Math.floor(Math.random() * 10) + 1 }
    };
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
  try {
    const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error('Unable to retrieve weather for current location.');
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    return {
      current: weatherData,
      forecast: forecastData,
      uv: { value: Math.floor(Math.random() * 10) + 1 }
    };
  } catch (error) {
    showError(error.message);
    return null;
  }
}

function convertTemp(temp) {
  return isCelsius ? `${Math.round(temp)}°C` : `${Math.round(temp * 9 / 5 + 32)}°F`;
}

function getUVLevel(uv) {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}

function renderChart(labels, temps) {
  const ctx = document.getElementById('tempChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  const isDarkMode = !document.body.classList.contains('light-mode');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Temperature (${isCelsius ? '°C' : '°F'})`,
        data: temps,
        backgroundColor: 'rgba(0, 204, 255, 0.1)',
        borderColor: '#00ccff',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#00ccff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
          titleColor: isDarkMode ? '#fff' : '#333',
          bodyColor: isDarkMode ? '#fff' : '#333',
          borderColor: '#00ccff',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isDarkMode ? '#fff' : '#000',
            font: { size: 12, weight: '500' }
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            lineWidth: 1
          },
          ticks: {
            color: isDarkMode ? '#fff' : '#000',
            font: { size: 12, weight: '500' },
            callback: value => `${Math.round(value)}°`
          }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
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
  uvIndex.textContent = `UV ${getUVLevel(uv.value)}`;

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
        day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
        temp: item.main.temp,
        icon: item.weather[0].icon
      };
    }
  });

  const todayKey = today.toISOString().split('T')[0];
  const sortedDates = Object.keys(dailyForecasts).sort();
  const futureDates = sortedDates.filter(date => date !== todayKey).slice(0, 5);

  forecastContainer.innerHTML = '';
  const labels = [], temps = [];

  futureDates.forEach(date => {
    const forecast = dailyForecasts[date];
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <i class="fas ${getWeatherIcon(forecast.icon)} forecast-icon"></i>
      <div class="day-of-week">${forecast.day}</div>
      <div class="forecast-date">${forecast.date}</div>
      <div class="forecast-temp">${convertTemp(forecast.temp)}</div>
    `;
    forecastContainer.appendChild(card);
    labels.push(forecast.day);
    temps.push(isCelsius ? forecast.temp : (forecast.temp * 9 / 5 + 32));
  });

  renderChart(labels, temps);
}

// Event Listeners
searchButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) return showError('Please enter a city name');
  const data = await getWeatherData(city);
  if (data) renderWeatherData(data);
});

cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchButton.click();
});

unitToggle.addEventListener('change', async () => {
  isCelsius = !unitToggle.checked;
  const city = locationName.textContent || 'Delhi';
  const data = await getWeatherData(city);
  if (data) renderWeatherData(data);
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', themeToggle.checked);
  if (chartInstance) {
    const city = locationName.textContent;
    if (city) {
      getWeatherData(city).then(data => {
        if (data) renderWeatherData(data);
      });
    }
  }
});

locateButton.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const data = await getWeatherByCoords(latitude, longitude);
      if (data) renderWeatherData(data);
    }, () => showError('Location permission denied.'));
  } else {
    showError('Geolocation not supported.');
  }
});

window.addEventListener('load', () => {
  const today = new Date();
  currentDate.textContent = today.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const data = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      if (data) renderWeatherData(data);
    }, async () => {
      const data = await getWeatherData('Delhi');
      if (data) renderWeatherData(data);
    });
  } else {
    getWeatherData('Delhi').then(data => {
      if (data) renderWeatherData(data);
    });
  }
});

// Extra animations
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .forecast-card { transition: all 0.3s ease; }
    .forecast-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 12px 24px rgba(0, 204, 255, 0.2); }
    .detail-item { transition: all 0.3s ease; }
    .detail-item:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 16px rgba(0, 204, 255, 0.15); }
  `;
  document.head.appendChild(style);
});

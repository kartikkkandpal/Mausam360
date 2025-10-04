import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const useWeatherData = (city) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    setNotFound(false);

    // Current weather
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          setWeather(null);
          setForecast([]);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setWeather(data);
      });

    // 5-day forecast
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((res) => {
        if (!res.ok) {
          setForecast([]);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.list) {
          // Group by day
          const daily = [];
          const map = {};
          data.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0];
            if (!map[date]) {
              map[date] = {
                day: new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
                date: date.slice(5).replace("-", "/"),
                temp: Math.round(item.main.temp),
                weather: item.weather[0].main,
              };
              daily.push(map[date]);
            }
          });
          setForecast(daily.slice(0, 5));
        }
        setLoading(false);
      });
  }, [city]);

  return { weather, forecast, loading, notFound };
};
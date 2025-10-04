import React from "react";
import { Cloud, Droplets, Wind, Sun, CloudRain, CloudLightning, CloudSnow, CloudFog, Gauge, Sunrise } from "lucide-react";

const weatherIcons = {
  "Clear": <Sun size={40} className="text-sky-400" />,
  "Clouds": <Cloud size={40} className="text-sky-400" />,
  "Rain": <CloudRain size={40} className="text-sky-400" />,
  "Drizzle": <CloudRain size={40} className="text-sky-400" />,
  "Thunderstorm": <CloudLightning size={40} className="text-sky-400" />,
  "Snow": <CloudSnow size={40} className="text-sky-400" />,
  "Mist": <CloudFog size={40} className="text-sky-400" />,
  "Smoke": <CloudFog size={40} className="text-sky-400" />,
  "Haze": <CloudFog size={40} className="text-sky-400" />,
  "Dust": <CloudFog size={40} className="text-sky-400" />,
  "Fog": <CloudFog size={40} className="text-sky-400" />,
  "Sand": <CloudFog size={40} className="text-sky-400" />,
  "Ash": <CloudFog size={40} className="text-sky-400" />,
  "Squall": <CloudFog size={40} className="text-sky-400" />,
  "Tornado": <CloudFog size={40} className="text-sky-400" />,
};

const WeatherCard = ({
  city = "City Name",
  date = "Thursday 26 June 2025",
  weatherMain = "Clouds",
  weatherDesc = "Broken Clouds",
  temp = 38,
  wind = 15,
  humidity = 40,
  sunrise = "--",
  pressure = "--",
}) => {
  return (
    <div
      className="rounded-xl p-4 shadow-xl flex flex-col items-center w-full max-w-xl h-full"
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="text-xs mb-1">{date}</div>
      <div className="text-3xl font-bold mb-1 text-center">{city}</div>
      <div className="text-sm text-[var(--text-secondary)] mb-1 text-center">{weatherDesc}</div>
      <div className="flex flex-col items-center mb-2">
        <div>
          {weatherIcons[weatherMain] || <Cloud size={40} className="text-sky-400" />}
        </div>
        <div className="text-3xl font-bold mt-1 drop-shadow">{temp}°C</div>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full mb-2">
        <div className="flex flex-col items-center bg-[var(--card-bg)] rounded-lg p-2">
          <Wind size={22} className="text-sky-400 mb-1" />
          <div className="text-[12px] font-bold">Wind: {wind} km/h</div>
        </div>
        <div className="flex flex-col items-center bg-[var(--card-bg)] rounded-lg p-2">
          <Droplets size={22} className="text-sky-400 mb-1" />
          <div className="text-[12px] font-bold">Humidity: {humidity}%</div>
        </div>
        <div className="flex flex-col items-center bg-[var(--card-bg)] rounded-lg p-2">
          <Sunrise size={22} className="text-yellow-400 mb-1" />
          <div className="text-[12px] font-bold">Sunrise: {sunrise}</div>
        </div>
        <div className="flex flex-col items-center bg-[var(--card-bg)] rounded-lg p-2">
          <Gauge size={22} className="text-sky-400 mb-1" />
          <div className="text-[12px] font-bold">Pressure: {pressure} hPa</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
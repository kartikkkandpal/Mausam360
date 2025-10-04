import React from "react";
import {
  Cloud, Droplets, Wind, Sun, CloudRain, CloudLightning,
  CloudSnow, CloudFog, Gauge, Sunrise
} from "lucide-react";

const weatherIcons = {
  "Clear": <Sun size={44} className="text-sky-400" />,
  "Clouds": <Cloud size={44} className="text-sky-400" />,
  "Rain": <CloudRain size={44} className="text-sky-400" />,
  "Drizzle": <CloudRain size={44} className="text-sky-400" />,
  "Thunderstorm": <CloudLightning size={44} className="text-sky-400" />,
  "Snow": <CloudSnow size={44} className="text-sky-400" />,
  "Mist": <CloudFog size={44} className="text-sky-400" />,
  "Smoke": <CloudFog size={44} className="text-sky-400" />,
  "Haze": <CloudFog size={44} className="text-sky-400" />,
  "Dust": <CloudFog size={44} className="text-sky-400" />,
  "Fog": <CloudFog size={44} className="text-sky-400" />,
  "Sand": <CloudFog size={44} className="text-sky-400" />,
  "Ash": <CloudFog size={44} className="text-sky-400" />,
  "Squall": <CloudFog size={44} className="text-sky-400" />,
  "Tornado": <CloudFog size={44} className="text-sky-400" />,
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
      className="rounded-xl p-6 shadow-xl flex flex-col justify-between w-full max-w-xl h-full min-h-[380px]"
      style={{
        background: "var(--card-bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Top: Date, City, Description */}
      <div className="flex flex-col items-center mb-2">
        <div className="text-xs opacity-80">{date}</div>
        <div className="text-3xl font-bold mt-1 mb-1 text-center">{city}</div>
        <div className="text-sm text-[var(--text-secondary)] mb-2 text-center capitalize">{weatherDesc}</div>
      </div>
      {/* Middle: Icon & Temperature */}
      <div className="flex flex-col items-center justify-center flex-1 mb-2">
        <div className="mb-2">
          {weatherIcons[weatherMain] || <Cloud size={44} className="text-sky-400" />}
        </div>
        <div className="text-5xl font-bold drop-shadow mb-1">{temp}°C</div>
      </div>
      {/* Bottom: Weather Details */}
      <div className="grid grid-cols-2 gap-2 w-full mt-2">
        <div className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-md p-2 min-h-[48px] w-full">
          <Wind size={18} className="text-sky-400 mb-1" />
          <div className="text-[12px] font-semibold text-center">Wind Speed</div>
          <div className="text-[11px]">{wind} km/h</div>
        </div>
        <div className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-md p-2 min-h-[48px] w-full">
          <Droplets size={18} className="text-sky-400 mb-1" />
          <div className="text-[12px] font-semibold text-center">Humidity %</div>
          <div className="text-[11px]">{humidity}%</div>
        </div>
        <div className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-md p-2 min-h-[48px] w-full">
          <Sunrise size={18} className="text-yellow-400 mb-1" />
          <div className="text-[12px] font-semibold text-center">Sunrise Time</div>
          <div className="text-[11px]">{sunrise}</div>
        </div>
        <div className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-md p-2 min-h-[48px] w-full">
          <Gauge size={18} className="text-sky-400 mb-1" />
          <div className="text-[12px] font-semibold text-center">Atmospheric Pressure</div>
          <div className="text-[11px]">{pressure} hPa</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
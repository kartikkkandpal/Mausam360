import React from "react";
import { CloudRain, Cloud, Sun } from "lucide-react";

const weatherIcons = {
  Rain: <CloudRain size={20} className="text-sky-400" />,
  Clouds: <Cloud size={20} className="text-sky-400" />,
  Clear: <Sun size={20} className="text-yellow-400" />,
};

const ForecastCard = ({ day, date, temp, weather }) => {
  return (
    <div
      className="flex flex-col items-center rounded-lg p-2 m-1 min-w-[76px] w-[76px] shadow-xl"
      style={{
        background: "var(--card-bg)",
        color: "var(--text-primary)",
      }}
    >
      <div>{weatherIcons[weather] || <Cloud size={20} className="text-sky-400" />}</div>
      <div className="font-medium mt-1 text-xs">{day}</div>
      <div className="text-[10px] text-[var(--text-secondary)]">{date}</div>
      <div className="font-bold text-sm mt-1">{temp}°C</div>
    </div>
  );
};

export default ForecastCard;
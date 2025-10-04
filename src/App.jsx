import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import ToggleTheme from "./components/ToggleTheme";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import TemperatureChart from "./components/TemperatureChart";
import { useWeatherData } from "./hooks/WeatherData";

const App = () => {
    const [city, setCity] = useState("Delhi");
    const { weather, forecast, loading, notFound } = useWeatherData(city);

    const handleSearch = (newCity) => {
        setCity(newCity);
    };

    const chartData = forecast.map(({ date, temp }) => ({ date, temp }));

    const sunrise = weather?.sys?.sunrise
        ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "--";

    return (
        <ThemeProvider>
            <div
                className="min-h-screen flex items-center justify-center px-2"
                style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    transition: "background 0.3s, color 0.3s",
                }}
            >
                <div
                    className="w-full max-w-[900px] rounded-2xl shadow-2xl p-3 flex flex-col gap-3 px-3 sm:px-6 py-3 sm:py-6"
                    style={{
                        background: "var(--bg-secondary)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between gap-2 flex-col sm:flex-row">
                        <SearchBar onSearch={handleSearch} />
                        <ToggleTheme />
                    </div>
                    {notFound && (
                        <div className="text-red-600 font-semibold text-center">
                            Place Not Found
                        </div>
                    )}
                    {/* Main Content */}
                    <div className="flex flex-col md:flex-row gap-3 md:h-[420px]">
                        {/* Left: WeatherCard */}
                        <div className="flex-1 flex flex-col h-full">
                            <WeatherCard
                                city={weather?.name || city}
                                date={
                                    weather
                                        ? new Date().toLocaleDateString("en-GB", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                          })
                                        : ""
                                }
                                weatherMain={weather?.weather?.[0]?.main}
                                weatherDesc={weather?.weather?.[0]?.description}
                                temp={weather?.main?.temp ? Math.round(weather.main.temp) : "--"}
                                wind={weather?.wind?.speed ? Math.round(weather.wind.speed) : "--"}
                                humidity={weather?.main?.humidity}
                                sunrise={sunrise}
                                pressure={weather?.main?.pressure}
                            />
                        </div>
                        {/* Right: TemperatureChart + Forecast */}
                        <div className="flex-1 flex flex-col h-full">
                            {/* TemperatureChart fills available space */}
                            <div className="flex-1 flex flex-col justify-between min-h-[180px]">
                                <TemperatureChart data={chartData} />
                            </div>
                            {/* Forecast at the bottom, shifted slightly down */}
                            <div className="mt-6">
                                <div className="font-semibold text-sm mb-1">Daily Forecast</div>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 -mb-3">
                                    {forecast.map((item, idx) => (
                                        <ForecastCard key={idx} {...item} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
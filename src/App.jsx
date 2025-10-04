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
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    transition: "background 0.3s, color 0.3s",
                }}
            >
                <div
                    className="w-[820px] rounded-2xl shadow-2xl p-6 flex flex-col gap-6"
                    style={{
                        background: "var(--bg-secondary)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between gap-3">
                        <SearchBar onSearch={handleSearch} />
                        <ToggleTheme />
                    </div>
                    {notFound && (
                        <div className="text-red-600 font-semibold mt-0.5 text-center">
                            Place Not Found
                        </div>
                    )}
                    {/* Main Content */}
                    <div className="flex gap-6">
                        {/* Left: Weather + Forecast */}
                        <div className="flex-1 flex flex-col gap-4">
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
                            <div>
                                <div className="font-semibold mb-2">Daily Forecast</div>
                                <div className="flex gap-1">
                                    {forecast.map((item, idx) => (
                                        <ForecastCard key={idx} {...item} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Right: Chart */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 w-full h-full">
                                <TemperatureChart data={chartData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
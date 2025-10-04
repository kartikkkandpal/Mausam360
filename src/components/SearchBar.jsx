import React, { useState } from "react";
import { Search, Menu } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <button className="p-2 rounded-full" aria-label="Menu">
        <Menu size={22} />
      </button>
      <form onSubmit={handleSubmit} className="flex flex-1 items-center bg-[var(--bg-secondary)] rounded-full px-4 py-2 shadow">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
        />
        <button type="submit" className="ml-2" aria-label="Search">
          <Search size={22} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
import React, { useState, useRef, useEffect } from "react";
import { Search, Menu } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef(null);

  // Reset history on reload/mount
  useEffect(() => {
    setHistory([]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setHistory((prev) =>
        prev.includes(city.trim())
          ? prev
          : [city.trim(), ...prev].slice(0, 5)
      );
      setCity(""); // Clear the search bar after search
      setShowHistory(false);
      setHighlighted(-1);
    }
  };

  const handleInputKeyDown = (e) => {
    if (showHistory && history.length > 0) {
      if (e.key === "ArrowDown") {
        setHighlighted((prev) =>
          prev < history.length - 1 ? prev + 1 : 0
        );
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setHighlighted((prev) =>
          prev > 0 ? prev - 1 : history.length - 1
        );
        e.preventDefault();
      } else if (e.key === "Enter" && highlighted >= 0) {
        setCity(history[highlighted]);
        setShowHistory(false);
        setHighlighted(-1);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setShowHistory(false);
        setHighlighted(-1);
      }
    }
  };

  const handleInputFocus = () => {
    if (history.length > 0) setShowHistory(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowHistory(false), 100); // Delay to allow click
  };

  const handleHistoryClick = (item) => {
    setCity(item);
    setShowHistory(false);
    inputRef.current.focus();
  };

  return (
    <div className="flex items-center gap-2 w-full relative">
      <button className="p-2 rounded-full" aria-label="Menu">
        <Menu size={22} />
      </button>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 items-center bg-[var(--bg-secondary)] rounded-full px-4 py-2 shadow"
        autoComplete="off"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (history.length > 0) setShowHistory(true);
          }}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          aria-autocomplete="list"
          aria-controls="search-history-list"
          aria-activedescendant={
            highlighted >= 0 ? `history-item-${highlighted}` : undefined
          }
        />
        <button
          type="submit"
          aria-label="Search"
          className={`
            p-2 rounded-full transition-colors duration-200 outline-none
            ${
              document.documentElement.classList.contains("light")
                ? "hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
                : "hover:bg-gray-700 hover:text-white"
            }
            active:scale-110
          `}
          style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
        >
          <Search size={22} />
        </button>
        {showHistory && history.length > 0 && (
          <ul
            id="search-history-list"
            className="absolute left-14 right-4 top-12 bg-[var(--bg-secondary)] rounded shadow z-10 max-h-48 overflow-y-auto"
          >
            {history.map((item, idx) => (
              <li
                key={item}
                id={`history-item-${idx}`}
                className={`px-4 py-2 cursor-pointer ${
                  highlighted === idx
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
                onMouseDown={() => handleHistoryClick(item)}
                onMouseEnter={() => setHighlighted(idx)}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
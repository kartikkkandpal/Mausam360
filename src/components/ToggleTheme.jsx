import React, { useContext, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    toggleTheme();
    setTimeout(() => setClicked(false), 250); // Animation duration
  };

  return (
    <button
      aria-label="Toggle Dark/Light Mode"
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors duration-200 outline-none
        ${
          theme === "light"
            ? "hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
            : "hover:bg-gray-700 hover:text-white"
        }
        ${clicked ? "scale-110 ring-2 ring-[var(--bg-primary)]" : ""}
      `}
      style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
    >
      {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
    </button>
  );
};

export default ToggleTheme;
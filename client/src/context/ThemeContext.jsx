import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Clean out legacy dark-mode key from previous visits
    try {
      localStorage.removeItem("crop_health_theme");
      const saved = localStorage.getItem("krushimitra_theme_v3");
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("krushimitra_theme_v3", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export { ThemeProvider, useTheme };

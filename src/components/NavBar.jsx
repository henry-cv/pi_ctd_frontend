import { useState } from "react";

const Navbar = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className={`navigation ${theme}`}>
      <h3>Home</h3>
      <h3>Favs</h3>
      <h3>Contact</h3>
      <button onClick={toggleTheme} className={theme}>
        <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
      </button>
    </nav>
  );
};

export default Navbar;

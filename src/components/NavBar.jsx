import { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import ButtonBluePill from "./ButtonBluePill";

const Navbar = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className={`navigation ${theme}`}>
      <div className="leftContainer">
        <img
          src="/Property 1=BlackV1.svg"
          alt="Logo"
          className="logo"
        />
        <p>Actividades</p>
        <p>Crea tu Actividad</p>
      </div>
      <div className="rightContainer">
        <button onClick={toggleTheme} className={theme}>
          <i
            className={`fa-regular ${theme === "light" ? "fa-moon" : "fa-sun"}`}
          ></i>
        </button>
        <button className={theme}>
          <FaGlobe />
        </button>
        <button>Registro</button>
        <ButtonBluePill text="Acceso" />
      </div>
    </nav>
  );
};

export default Navbar;

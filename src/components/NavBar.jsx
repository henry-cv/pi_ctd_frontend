import { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import Activities from "./Activities";
import ButtonBluePill from "./ButtonBluePill";
import '../css/NavBar.css';

const Navbar = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="navigation">
      <div className="leftContainer">
        <img src="/Property 1=BlackV1.svg" alt="Logo" className="logo" />
        <div className="hide-sm">
          <Activities />
        </div>
        <a href="#" className="nav-link hide-sm">Crea tu Actividad</a>
      </div>
      <div className="rightContainer">
        <button onClick={toggleTheme} className="icon-button">
          <i className={`fa-regular ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
        </button>
        <button className="icon-button">
          <FaGlobe />
        </button>
          <div className="hide-md">
          <ButtonBluePill text="Registro" className="button-transparent" />
        </div>
        <div className="hide-sm">
          <ButtonBluePill text="Acceso" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars,
  faGlobe, 
  faMoon, 
  faSun 
} from '@fortawesome/free-solid-svg-icons';
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
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </button>
        <button className="icon-button">
          <FontAwesomeIcon icon={faGlobe} />
        </button>
        <div className="hide-sm">
          <ButtonBluePill text="Acceso" />
        </div>
        {/* Botón hamburguesa en mobile con estilo de ButtonBluePill */}
        <div className="show-sm">
          <ButtonBluePill 
            text={<FontAwesomeIcon icon={faBars} />}
            className="button-blue mobile-menu-button"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGlobe, 
  faMoon, 
  faSun,
  faBars 
} from '@fortawesome/free-solid-svg-icons';
import Activities from "./Activities";
import ButtonGral from "./ButtonGral";
import BasicBreadcrumbs from "./BasicBreadcrumbs";
import PropTypes from 'prop-types';
import '../css/NavDashHome.css';

const NavDash = ({ variant = "home", isLoggedIn = false }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (variant === "admin") {
    return (
      <nav className="navbarDash admin">
        <div className="breadcrumb">
          <BasicBreadcrumbs />
        </div>
        <div className="user-info">
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} className="icon" />
          <div className="user-details">
            <p className="user-name">Luisa Lopez</p>
            <p className="user-role">Propietaria</p>
          </div>
          <img src="../user_example.jpg" alt="Perfil" className="user-avatar" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbarDash home">
      <div className="leftContainer">
        <img src="/Property 1=BlackV1.svg" alt="Logo" className="logo" />
        <Activities />
        <a href="#" className="nav-link">Crea tu Actividad</a>
      </div>
      <div className="rightContainer">
        <button onClick={toggleTheme} className="icon-button">
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </button>
        <button className="icon-button">
          <FontAwesomeIcon icon={faGlobe} />
        </button>
        {!isLoggedIn ? (
          <>
            <ButtonGral text="Registrar" color="transparent" />
            <ButtonGral text="Acceso" color="blue" />
          </>
        ) : (
          <div className="user-info">
            <img src="../user_example.jpg" alt="Perfil" className="user-avatar" />
          </div>
        )}
        <div className="mobile-menu">
          <button className="icon-button menu-button">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
    </nav>
  );
};

NavDash.propTypes = {
  variant: PropTypes.oneOf(['home', 'admin']),
  isLoggedIn: PropTypes.bool
};

export default NavDash;
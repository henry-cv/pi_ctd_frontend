
import { Link } from "react-router-dom"; // Añadimos import de Link
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faMoon,
  faSun,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Activities from "./Activities";
import ButtonGral from "./ButtonGral";
import BasicBreadcrumbs from "./BasicBreadcrumbs";
import PropTypes from "prop-types";
import "../css/NavDashHome.css";
import { useContextGlobal } from "../gContext/globalContext";
import LogoImg from "./LogoImg";

const NavDash = ({ variant = "home" }) => {
  const { dispatch, state } = useContextGlobal();

  if (variant === "admin") {
    return (
      <nav className="navbarDash admin">
        <div className="breadcrumb">
          <BasicBreadcrumbs />
        </div>
        <div className="user-info">
          <button
            onClick={() => dispatch({ type: "CHANGE_THEME" })}
            className="icon-button"
          >
            <FontAwesomeIcon icon={state.theme === "dark" ? faSun : faMoon} />
          </button>
          <div className="user-details">
            <p className="user-name">Luisa Lopez</p>
            <p className="user-role">Propietaria</p>
          </div>
          <img src="../user_example.webp" alt="Perfil" className="user-avatar" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbarDash home">
      <div className="leftContainer">
        <LogoImg inNavbar={true} />
        <div className="hide-mobile">
          <Activities />
          <a href="#" className="nav-link">
            Crea tu Actividad
          </a>
        </div>
      </div>
      <div className="rightContainer">
        <div className="theme-globe-buttons">
          {" "}
          {/* Nuevo contenedor sin hide-mobile */}
          <button
            onClick={() => dispatch({ type: "CHANGE_THEME" })}
            className="icon-button"
          >
            <FontAwesomeIcon icon={state.theme === "dark" ? faSun : faMoon} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faGlobe} />
          </button>
        </div>
        <div className="auth-buttons hide-mobile">
          {" "}
          {/* Movido hide-mobile aquí */}
          <div className="hide-tablet">
            <ButtonGral text="Registrar" color="transparent" />
          </div>
          <Link to="/administrador">
            {" "}
            {/* Añadimos Link al botón de acceso */}
            <ButtonGral text="Acceso" color="blue" />
          </Link>
        </div>
        <div className="show-mobile">
          <button className="icon-button menu-button">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
    </nav>
  );
};

NavDash.propTypes = {
  variant: PropTypes.oneOf(["home", "admin"]),
};

export default NavDash;

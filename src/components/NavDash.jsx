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
import "../css/components/NavDashHome.css";
import { useContextGlobal } from "../gContext/globalContext";
import LogoImg from "./LogoImg";
import AccountMenu from "./AccountMenu";
import Skeleton from "@mui/material/Skeleton";

const NavDash = ({ variant = "home" }) => {
  const { dispatch, state } = useContextGlobal();

  const handleClick = () => {

    if (state.userFiltersTabs.activeTab === "reservations") {
      dispatch({
        type: "SET_ACTIVE_TAB_FILTER",
        payload: { activeTab: "edit-profile" },
      });    
    }
  };


  if (variant === "admin") {
    return (
      <nav className="navbarDash admin">
        <div className="breadcrumb">
          <BasicBreadcrumbs />
        </div>
        <div className="user-info-nav">
          <button
            onClick={() => dispatch({ type: "CHANGE_THEME" ,
              payload: state.theme === "dark" ? "ligth" : "dark",
            })}
            className="icon-button"
          >
            <FontAwesomeIcon icon={state.theme === "dark" ? faSun : faMoon} />
          </button>
          <AccountMenu />
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbarDash home">
      <div className="leftContainer">
        <div className="show-mobile">
          <button className="icon-button menu-button">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <Link to="/"
        onClick={handleClick}>
          <LogoImg inNavbar={true} />
        </Link>
        <div className="hide-mobile">
          <Activities />
        </div>
      </div>
      <div className="rightContainer">
        <div className="theme-globe-buttons">
          <button
            onClick={() => dispatch({ type: "CHANGE_THEME" ,
              payload: state.theme === "dark" ? "ligth" : "dark",
            })}
            className="icon-button"
          >
            <FontAwesomeIcon icon={state.theme === "dark" ? faSun : faMoon} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faGlobe} />
          </button>
        </div>

        {state.isLoading ? (
          <div className="skeleton-container">
            <Skeleton variant="text" width={100} height={34} animation="wave" />
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          </div>
        ) : state.isAuthenticated ? (
          <div>
            <AccountMenu />
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to={"/registro"} className="hide-tablet">
              <ButtonGral text="Registrar" color="transparent" />
            </Link>
            <Link to="/entrar">
              <ButtonGral text="Acceso" color="blue" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

NavDash.propTypes = {
  variant: PropTypes.oneOf(["home", "admin"]),
};

export default NavDash;

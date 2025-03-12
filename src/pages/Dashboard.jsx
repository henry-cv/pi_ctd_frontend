import "../css/pages/dashboard.css";
import "../css/global/variables.css";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleDown, FaUserCog } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { ListSidebar } from "../constants/ListSidebar";
import NavDash from "../components/NavDash";

const Dashboard = () => {
  const activeLink = "isActiveDash";
  const normalLink = "listDashHover";
  const [barOpen, setBarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Comprobar si estamos en la ruta de ajustes o alguna subruta
  const isAjustesActive = location.pathname.includes('/administrador/ajustes');

  const handleBar = () => {
    setBarOpen(!barOpen);
  };

  const toggleSettings = (e) => {
    e.stopPropagation(); // Evita que el clic se propague al contenedor principal
    e.preventDefault(); // Previene la navegación por defecto
    setSettingsOpen(!settingsOpen);
  };

  const handleAjustesClick = () => {
    navigate("/administrador/ajustes");
  };

  return (
    <main className="dashboard_container">
      <div className={`${barOpen ? "admin_container" : "admin_container2"}`}>
        <article className="sidebar">
          <div className="logo_container">
            <Link to={"/"}>
              <img
                src={`${
                  barOpen
                    ? "https://res.cloudinary.com/drq4tucwt/image/upload/v1740759880/GoBook_LOGO_LIGHT_x7tb97.svg"
                    : "https://res.cloudinary.com/drq4tucwt/image/upload/v1740759889/LogoDashSM_h7iijn.svg"
                }`}
                alt="logo goBook"
                width={`${barOpen && 125}`}
                className="logoSidebar"
              />
            </Link>
          </div>

          <div className="list_sidebar">
            {ListSidebar.map(({ label, icon, to, id }) => {
              // Si es el ítem "Ajustes", lo manejamos de forma especial
              if (to === "ajustes") {
                return (
                  <div key={id} className="settings-menu-container">
                    {barOpen ? (
                      // Versión expandida
                      <div 
                        className={`listDash ${isAjustesActive ? activeLink : normalLink} settings-main-item`}
                        onClick={handleAjustesClick}
                      >
                        <IoMdSettings size="1.7rem" className="settings-icon" />
                        <span className="listNameSide">{label}</span>
                        <div 
                          className="arrow-container" 
                          onClick={toggleSettings}
                        >
                          <FaAngleDown size="1rem" className="settings-arrow" />
                        </div>
                      </div>
                    ) : (
                      // Versión colapsada
                      <div
                        className={`listDash2 ${isAjustesActive ? "isActiveDash2" : normalLink}`}
                        onClick={handleAjustesClick}
                      >
                        <IoMdSettings size="1.7rem" className="settings-icon" />
                      </div>
                    )}
                    
                    {/* Dropdown menu for settings */}
                    {settingsOpen && barOpen && (
                      <div className="settings-dropdown-menu">
                        <NavLink
                          to="ajustes/asignar-rol"
                          className={({ isActive }) =>
                            `settings-dropdown-item ${isActive ? "active" : ""}`
                          }
                        >
                          <FaUserCog size="1.2rem" />
                          <span>Asignar Rol</span>
                        </NavLink>
                        {/* Puedes agregar más opciones aquí */}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Para los demás ítems, se mantiene igual
              return (
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${barOpen ? "listDash" : "listDash2"}  ${
                      isActive && barOpen ? activeLink : normalLink
                    } ${!barOpen && isActive && "isActiveDash2"}`
                  }
                  key={id}
                >
                  {icon}
                  {barOpen && <span className="listNameSide">{label}</span>}
                </NavLink>
              );
            })}
          </div>
          <button
            className={`${
              !barOpen
                ? "circleToggle shadowCircle"
                : "circleToggle animationToggle"
            }`}
            onClick={handleBar}
          >
            <FaAngleRight />
          </button>
        </article>
        <section>
          <NavDash variant="admin" />
          <Outlet />
        </section>
      </div>
      <div className="admin_hidden">
        <h2>DISPONIBLE SÓLO EN DESKTOP🖥️</h2>
      </div>
    </main>
  );
};

export default Dashboard;
import "../css/pages/dashboard.css";
import "../css/global/variables.css";
import { Link, NavLink, Outlet } from "react-router-dom";

import { FaAngleRight } from "react-icons/fa";
import { ListSidebar } from "../constants/ListSidebar";
import NavDash from "../components/NavDash";
import { useState } from "react";

const Dashboard = () => {
  const activeLink = "isActiveDash";
  const normalLink = "listDashHover";
  const [barOpen, setBarOpen] = useState(false);

  const handleBar = () => {
    setBarOpen(!barOpen);
  };

  return (
    <main className="dashboard_container">
      <div className={`${barOpen ? "admin_container" : "admin_container2"}`}>
        <article className="sidebar">
          <div className="logo_container">
            <Link to={"/"}>
              <img
                src={`${
                  barOpen ? "../GoBook_LOGO_LIGHT.svg" : "../LogoDashSM.svg"
                }`}
                alt="logo goBook"
                width={`${barOpen && 125}`}
                className="logoSidebar"
              />
            </Link>
          </div>

          <div className="list_sidebar">
            {ListSidebar.map(({ label, icon, to, id }) => (
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
            ))}
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
      {/* <Footer /> */}
    </main>
  );
};

export default Dashboard;

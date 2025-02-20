import React from "react";
import "../css/dashboard.css";
import "../css/variables.css";
import Navbar from "../components/NavBar";
import { Link, NavLink, Outlet } from "react-router-dom";

import { FaAngleRight } from "react-icons/fa";
import { ListSidebar } from "../constantes/ListSidebar";
import NavDash from "../components/NavDash";

const Dashboard = () => {
  const activeLink = "isActiveDash";
  const normalLink = "listDashHover";
  return (
    <>
      <div className="admin_container">
        <article className="sidebar">
          <div className="logo_container">
            <Link to={"/"}>
              <img
                src="../GoBook_LOGO_LIGHT.svg"
                alt="logo goBook"
                width={125}
                className="logoSidebar"
              />
            </Link>
          </div>
          
          <div className="list_sidebar">
            {ListSidebar.map(({ label, icon, to, id }) => (
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `listDash ${isActive ? activeLink : normalLink}`
                }
                key={id}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
          <button className="circleToggle">
            <FaAngleRight />
          </button>
        </article>
        <section>
          <NavDash />
          <Outlet />
        </section>
      </div>
    </>
  );
};

export default Dashboard;

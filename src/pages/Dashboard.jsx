import "../css/dashboard.css";
import "../css/variables.css";
import { Link, NavLink, Outlet } from "react-router-dom";

import { FaAngleRight } from "react-icons/fa";
import { ListSidebar } from "../constants/ListSidebar";
import NavDash from "../components/NavDash";
import Footer from "../components/Footer";

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
          <NavDash variant="admin" />
          <Outlet />
        </section>
      </div>
    <Footer/>
    </>
  );
};

export default Dashboard;

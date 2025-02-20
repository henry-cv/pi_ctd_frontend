import React from "react";
import { FaMoon } from "react-icons/fa";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

const NavDash = () => {
  return (
    <nav className="navbarDash">
      <div className="breadcrumb">
        <BasicBreadcrumbs />
      </div>

      <div className="user-info">
        <FaMoon className="icon" />
        <div className="user-details">
          <p className="user-name">Luisa Lopez</p>
          <p className="user-role">Propietaria</p>
        </div>
        <img src="../user_example.jpg" alt="Perfil" className="user-avatar" />
      </div>
    </nav>
  );
};

export default NavDash;

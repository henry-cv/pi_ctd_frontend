// src/components/UserProfileSectionsTabs.jsx
import React from "react";
import "../css/components/UserProfileSectionsTabs.css";
import { useContextGlobal } from "../gContext/globalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarAlt, faHeart } from "@fortawesome/free-regular-svg-icons";

const UserProfileSectionsTabs = () => {
  const { state, dispatch } = useContextGlobal();

  const handleTabChange = (tab) => {
    dispatch({
      type: "SET_ACTIVE_TAB",
      payload: tab,
    });
  };

  return (
    <div className="profile-tabs">
      <button
        className={`tab-button ${state.activeTab === "edit-profile" ? "active" : ""}`}
        onClick={() => handleTabChange("edit-profile")}
      >
        <FontAwesomeIcon icon={faUser} />
        <span>Editar Perfil</span>
      </button>
      <button
        className={`tab-button ${state.activeTab === "reservations" ? "active" : ""}`}
        onClick={() => handleTabChange("reservations")}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>Mis reservas</span>
      </button>
      <button
        className={`tab-button ${state.activeTab === "favorites" ? "active" : ""}`}
        onClick={() => handleTabChange("favorites")}
      >
        <FontAwesomeIcon icon={faHeart} />
        <span>Mis favoritos</span>
      </button>
    </div>
  );
};

export default UserProfileSectionsTabs;
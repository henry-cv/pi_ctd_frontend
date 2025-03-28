
import "../css/components/UserProfileSectionsTabs.css";
import { useContextGlobal } from "../gContext/globalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarAlt, faHeart } from "@fortawesome/free-regular-svg-icons";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { el } from "date-fns/locale";
import { faCancel, faClose, faPlus } from "@fortawesome/free-solid-svg-icons";

const UserProfileSectionsTabs = () => {
  const { state, dispatch } = useContextGlobal();

  //función para mandar el valor del tab activo y/o el filtro seleccionado
  const handleChange = (type, value) => {
    console.log(type, value);
  
    if (type === "tab") {
      dispatch({
        type: "SET_ACTIVE_TAB_FILTER",
        payload: { activeTab: value },
      });
    } else if (type === "filter") {
      dispatch({
        type: "SET_ACTIVE_TAB_FILTER",
        payload: { selectedFilters: value },
      });
    }
  };
  

  return (
    <div className="profile-tabs-container">

<div className="profile-tabs">
      <button
        className={`tab-button ${state.userFiltersTabs.activeTab === "edit-profile" ? "active" : ""}`}
        onClick={() => handleChange("tab","edit-profile")}
      >
        <FontAwesomeIcon icon={faUser} />
        <span>Editar Perfil</span>
      </button>
      <button
        className={`tab-button ${state.userFiltersTabs.activeTab === "reservations" ? "active" : ""}`}
        onClick={() => handleChange("tab","reservations")}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>Mis reservas</span>
      </button>
      <button
        className={`tab-button ${state.userFiltersTabs.activeTab === "favorites" ? "active" : ""}`}
        onClick={() => handleChange("tab","favorites")}
      >
        <FontAwesomeIcon icon={faHeart} />
        <span>Mis favoritos</span>
      </button>
    </div>

{state.userFiltersTabs.activeTab === "reservations" ?<>
  <div className="booking-tabs">
      <button
        className={`booking-tab-button ${state.userFiltersTabs.selectedFilters === "confirm" ? "active-filter" : ""}`}
        onClick={() => handleChange("filter","confirm")}
      >
        <FontAwesomeIcon icon={state.userFiltersTabs.selectedFilters === "confirm" ? faClose : faPlus} />
        <span>Confirmadas</span>
      </button>
      <button
        className={`booking-tab-button ${state.activeTab === "complete" ? "active-filter" : ""}`}
        onClick={() => handleChange("filter","complete")}
      >
        <FontAwesomeIcon icon={state.userFiltersTabs.selectedFilters === "complete" ? faClose : faPlus} />
        <span>Finalizadas</span>
      </button>
      <button
        className={`booking-tab-button ${state.activeTab === "cancel" ? "active-filter" : ""}`}
        onClick={() => handleChange("filter","cancel")}
      >
        <FontAwesomeIcon icon={state.userFiltersTabs.selectedFilters === "cancel" ? faClose : faPlus} />
        <span>Canceladass</span>
      </button>
    </div>
</> : <> </>}


    
    

    </div>

  );
};

export default UserProfileSectionsTabs;
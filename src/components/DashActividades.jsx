import React from "react";
import DashSearch from "./DashSearch";
import ButtonGral from "./ButtonGral";
import { FaCirclePlus } from "react-icons/fa6";
import { LuListFilter } from "react-icons/lu";

import "../css/dashboard.css";
import ActivitieRow from "./ActivitieRow";
import { Link } from "react-router-dom";

const DashActividades = () => {
  return (
    <div className="activities_container">
      <div className="header_activities">
        <h2>Mis Actividades</h2>
        <div className="activitieRight">
          <div className="searchFilter">
            <DashSearch />
            <button className="btnIconFilter">
              <LuListFilter size={"2rem"} />
            </button>
          </div>
          <Link to={"crear actividad"}>
            <ButtonGral
              text={"Agregar actividad"}
              color="yellow"
              icon={<FaCirclePlus size={"1.5rem"} />}
            />
          </Link>
        </div>
      </div>

      <div className="table_activities">
        <div>
          <span className="titleTable">Actividad</span>
        </div>
        <div>
          <span className="titleTable">Reservas</span>
        </div>
        <div>
          <span className="titleTable">Acciones</span>
        </div>
      </div>

      {/* Componente registro */}
      <ActivitieRow
        imagen={"../activitie.jpg"}
        titulo={"Cena 4 tiempos"}
        reservas="25"
      />
      
      <ActivitieRow
        imagen={"../activitie.jpg"}
        titulo={"Cata de vino"}
        reservas="25"
      />

      {/* <div className="activities_info_img">
        <p>
          Aún no tienes actividades creadas. ¡Empieza ahora y añade tu primera
          actividad!
        </p>
        <img src="../activitiesImg.png" alt="Sin actividades" />
      </div> */}
      
    </div>
  );
};

export default DashActividades;

import { useState, useEffect } from "react";
import DashSearch from "./DashSearch";
import ButtonGral from "./ButtonGral";
import { FaCirclePlus } from "react-icons/fa6";
import { LuListFilter } from "react-icons/lu";

import "../css/dashboard.css";
import ActivitieRow from "./ActivitieRow";
import { Link } from "react-router-dom";

const DashActividades = () => {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📡 Cargar actividades desde el backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://34.192.152.81:8080/producto/listar");
        if (!response.ok) {
          throw new Error(`Error al obtener actividades: ${response.status}`);
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error cargando actividades:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
          {/* 🔗 Corregir la ruta a la creación de actividades */}
          <Link to="crearactividad">
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

      {/* 🛠 Mostrar mensaje de carga */}
      {loading && <p>Cargando actividades...</p>}

      {/* 🚨 Mostrar error si hay problemas con la carga */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* 🔥 Renderizar actividades si existen */}
      {!loading && !error && activities.length > 0 ? (
        activities.map((activity) => (
          <ActivitieRow
            key={activity.id}
            imagen={activity.imagenes?.[0] || "/activitie.jpg"} // 🖼 Imagen por defecto si no hay imagen
            titulo={activity.nombre}
            reservas={activity.reservas || "0"} // 📌 Asegurar un número de reservas
          />
        ))
      ) : (
        // 📌 Mostrar mensaje si no hay actividades creadas
        !loading && !error && (
          <div className="activities_info_img">
            <p>
              Aún no tienes actividades creadas. ¡Empieza ahora y añade tu primera actividad!
            </p>
            <img src="/activitiesImg.png" alt="Sin actividades" />
          </div>
        )
      )}
    </div>
  );
};

export default DashActividades;

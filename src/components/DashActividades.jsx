import { useState, useEffect } from "react";
import DashSearch from "./DashSearch";
import ButtonGral from "./ButtonGral";
import { FaCirclePlus } from "react-icons/fa6";
import { LuListFilter } from "react-icons/lu";
import "../css/dashboard.css";
import ActivitieRow from "./ActivitieRow";
import { Link } from "react-router-dom";
import BasicPagination from "./BasicPagination";

const DashActividades = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]); // Nuevo estado filtrado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState(""); // Estado de búsqueda

  const lastActivity = currentPage * activitiesPerPage;
  const firstActivity = lastActivity - activitiesPerPage;
  const allPages = Math.ceil(filteredActivities.length / activitiesPerPage);
  const currentActivities = filteredActivities.slice(
    firstActivity,
    lastActivity
  );

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/producto/listar");
        if (!response.ok) {
          throw new Error(`Error al obtener actividades: ${response.status}`);
        }
        const data = await response.json();
        setActivities(data);
        setFilteredActivities(data); // Inicialmente, las actividades filtradas son todas
      } catch (error) {
        console.error("Error cargando actividades:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(
        activities.filter((activity) =>
          activity.nombre.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id));
    setFilteredActivities((prev) =>
      prev.filter((activity) => activity.id !== id)
    );
  };

  return (
    <div className="activities_container">
      <div className="header_activities">
        <h2>Mis Actividades</h2>
        <div className="activitieRight">
          <div className="searchFilter">
            <DashSearch onSearch={handleSearch} />{" "}
            <button className="btnIconFilter">
              <LuListFilter size={"2rem"} />
            </button>
          </div>
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

      {loading && <p>Cargando actividades...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && currentActivities.length > 0
        ? currentActivities.map((activity) => (
            <ActivitieRow
              key={activity.id}
              id={activity.id}
              imagen={
                activity.imagenesSalidaDto?.[0]?.rutaImagen || "/activitie.webp"
              }
              titulo={activity.nombre}
              reservas={activity.reservas || "0"}
              onDelete={handleDelete}
            />
          ))
        : !loading &&
          !error && (
            <div className="activities_info_img">
              <p>
                {searchTerm
                  ? "No hay actividades que coincidan con la búsqueda."
                  : "Aún no tienes actividades creadas. ¡Empieza ahora y añade tu primera actividad!"}
              </p>
              <img src="/activitiesImg.webp" alt="Sin actividades" />
            </div>
          )}

      <div className="pagination_dash">
        <BasicPagination
          count={allPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default DashActividades;

import "../css/pages/dashboard.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashSearch from "./DashSearch";
import ButtonGral from "./ButtonGral";
import { FaCirclePlus } from "react-icons/fa6";
import { LuListFilter } from "react-icons/lu";
import BasicPagination from "./BasicPagination";
import CharacteristicRow from "./CharacteristicRow";
import { useContextGlobal } from "../gContext/globalContext";

const DashCharacteristics = () => {
  const navigate = useNavigate();
  const { state } = useContextGlobal();

  const [characteristics, setCharacteristics] = useState([]);
  const [filteredCharacteristics, setFilteredCharacteristics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [characteristicsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");

  const lastCharacteristic = currentPage * characteristicsPerPage;
  const firstCharacteristic = lastCharacteristic - characteristicsPerPage;
  const allPages = Math.ceil(filteredCharacteristics.length / characteristicsPerPage);
  const currentCharacteristics = filteredCharacteristics.slice(
    firstCharacteristic,
    lastCharacteristic
  );

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        setLoading(true);

        const token = state.token || localStorage.getItem("token");

        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }

        const response = await fetch("/api/caracteristica/listar", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener características: ${response.status}`);
        }

        const data = await response.json();
        setCharacteristics(data);
        setFilteredCharacteristics(data);
      } catch (error) {
        console.error("Error cargando características:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacteristics();
  }, [state.token]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredCharacteristics(characteristics);
    } else {
      setFilteredCharacteristics(
        characteristics.filter((characteristic) =>
          characteristic.nombre.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setCharacteristics((prev) => prev.filter((characteristic) => characteristic.id !== id));
    setFilteredCharacteristics((prev) =>
      prev.filter((characteristic) => characteristic.id !== id)
    );
  };

  const handleUpdate = (characteristicId) => {
    navigate(`/administrador/caracteristicas/editarCaracteristica`, {
      state: { characteristicId }
    });
  };

  return (
    <div className="characteristics_container activities_container">
      <header className="header_characteristics header_activities">
        <h2 className="dark_activities">Características</h2>
        <div className="characteristicRight activitieRight">
          <div className="searchFilter">
            <DashSearch onSearch={handleSearch} />
            <button className="btnIconFilter">
              <LuListFilter size={"2rem"} />
            </button>
          </div>
          <Link to="crearcaracteristica">
            <ButtonGral
              text={"Nueva Característica"}
              color="yellow"
              icon={<FaCirclePlus size={"1.5rem"} />}
            />
          </Link>
        </div>
      </header>

      <div className="table_activities table_features">
        <div>
          <span className="titleTable">Característica</span>
        </div>
        <div>
          <span className="titleTable">Acciones</span>
        </div>
      </div>

      {loading && <p>Cargando características...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && currentCharacteristics.length > 0
        ? currentCharacteristics.map((characteristic) => (
          <CharacteristicRow
            key={characteristic.id}
            id={characteristic.id}
            nombre={characteristic.nombre}
            icono={characteristic.icono}
            onDelete={handleDelete}
            onUpdate={() => handleUpdate(characteristic.id)}
          />
        ))
        : !loading &&
        !error && (
          <div className="characteristics_info_img activities_info_img">
            <p>
              {searchTerm
                ? "No hay características que coincidan con la búsqueda."
                : "Aún no tienes características creadas. ¡Empieza ahora y añade tu primera característica!"}
            </p>
            <img src="/characteristicsImg.webp" alt="Sin características" />
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

export default DashCharacteristics;
import "../css/pages/dashboard.css";
import FormNewCategory from "./FormNewCategory";
import { useState, useEffect } from "react";
import DashSearch from "./DashSearch";
import ButtonGral from "./ButtonGral";
import { FaCirclePlus } from "react-icons/fa6";
import { LuListFilter } from "react-icons/lu";
import "../css/pages/dashboard.css";
import ActivitieRow from "./ActivitieRow";
import { Link } from "react-router-dom";
import BasicPagination from "./BasicPagination";

const DashCategorias = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); // Nuevo estado filtrado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState(""); // Estado de búsqueda

  const lastActivity = currentPage * categoriesPerPage;
  const firstActivity = lastActivity - categoriesPerPage;
  const allPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const currentCategories = filteredCategories.slice(
    firstActivity,
    lastActivity
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categorias/listar");
        if (!response.ok) {
          throw new Error(`Error al obtener las categorías: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data); // Inicialmente, las actividades filtradas son todas
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((category) =>
          category.nombre.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
    setFilteredCategories((prev) =>
      prev.filter((category) => category.id !== id)
    );
  };

  return (
    <>
      <div className="categories_container">
        <header className="header_categories">
          <h2>Nueva Categoría</h2>
          <div className="activitieRight">
            <div className="searchFilter">
              <DashSearch onSearch={handleSearch} />{" "}
              <button className="btnIconFilter">
                <LuListFilter size={"2rem"} />
              </button>
            </div>
            <Link to="crearcategoria">
              <ButtonGral
                text={"Nueva Categoría"}
                color="yellow"
                icon={<FaCirclePlus size={"1.5rem"} />}
              />
            </Link>
          </div>
        </header>

        <div className="table_categories">
          <div><span className="titleTable">Categoría</span></div>
          <div><span className="titleTable">Acciones</span></div>
        </div>
      </div>

      {loading && <p>Cargando categorías...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <FormNewCategory />
    </>
  );
};

export default DashCategorias;

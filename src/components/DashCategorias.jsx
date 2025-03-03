import "../css/pages/dashboard.css";
//import FormNewCategory from "./FormNewCategory";
import { useState, useEffect } from "react";
import DashSearch from "./DashSearch";
import ButtonGral from "./ButtonGral";
import { FaCirclePlus } from "react-icons/fa6";
import { LuListFilter } from "react-icons/lu";
import CategoryRow from "./CategoryRow";
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

  const lastCategory = currentPage * categoriesPerPage;
  const firstCategory = lastCategory - categoriesPerPage;
  const allPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const currentCategories = filteredCategories.slice(
    firstCategory,
    lastCategory
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categoria/listar");
        if (!response.ok) {
          throw new Error(`Error al obtener las categorías: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data); // Inicialmente, las categorías filtradas son todas
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
    <div className="categories_container activities_container">
      <header className="header_categories header_activities">
        <h2 className="dark_activities">Nueva Categoría</h2>
        <div className="categoryRight activitieRight">
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

      {loading && <p>Cargando categorías...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && currentCategories.length > 0
        ? currentCategories.map((category) => (
          console.log(category),
          <CategoryRow
            key={category.id}
            id={category.id}
            imagenCategoriaUrl={
              category.imagenCategoriaUrl ||
              "/categorie.webp"
            }
            nombre={category.nombre}
            onDelete={handleDelete}
          />
        ))
        : !loading &&
        !error && (
          <div className="categories_info_img activities_info_img">
            <p>
              {searchTerm
                ? "No hay categorías que coincidan con la búsqueda."
                : "Aún no tienes categorías creadas. ¡Empieza ahora y añade tu primera categoría!"}
            </p>
            <img src="/categoriesImg.webp" alt="Sin categorías" />
          </div>
        )
      }
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

export default DashCategorias;

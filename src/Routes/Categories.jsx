import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categoria/listar");
        if (!response.ok) {
          throw new Error(`Error al obtener categorías: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error cargando categorías:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/actividades?categoria=${encodeURIComponent(categoryName)}`);
    window.location.reload();
  };

  if (loading) {
    return <h6>Cargando categorías...</h6>;
  }
  if (error) {
    return <h6>Error: {error}</h6>;
  }

  return (
    <div>
      {categories.length > 0 ? (
        <ul className="list-categories">
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleCategoryClick(category.nombre)}
              style={{ cursor: "pointer" }}
            >
              {category.nombre}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay categorías disponibles.</p>
      )}
    </div>
  );
};

export default Categories;

import { useEffect, useState } from "react";
import "../css/components/CategoryCard.css";
import PropTypes from "prop-types";

const CategoryCard = ({ title, image }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categoria/listar");
        if (!response.ok) throw new Error(`Error al obtener categorías: ${response.status}`);

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-item">
              <img src={category.imagenCategoriaUrl} alt={category.nombre} className="category-image" />
              <div className="category-content">
                <h3 className="category-title">{category.nombre}</h3>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="category-card">
          <img src={image} alt={title} className="category-image" />
          <div className="category-content">
            <h3 className="category-title">{title}</h3>
          </div>
        </div>
      )}
    </>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default CategoryCard;

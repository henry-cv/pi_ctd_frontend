import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import "../css/pages/FilterProducts.css";
import NavDash from "../components/NavDash";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faMap,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import DurationInfo from "../components/DurationInfo";

const FilterProducts = () => {
  const [searchParams] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categoria/listar");
        if (!response.ok) {
          throw new Error("Error al obtener categorías");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategories();
  }, []);

  // Cargar actividades
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/producto/listar");
        if (!response.ok) {
          throw new Error("Error al obtener actividades");
        }
        const data = await response.json();
        setActivities(data);
        applyFilters(data, selectedCategories, sortType);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Efecto para manejar parámetros de URL
  useEffect(() => {
    const categoryParam = searchParams.get("categoria");
    if (categoryParam) {
      const categoriesFromUrl = categoryParam.split(",");
      setSelectedCategories(categoriesFromUrl);
    }
  }, [searchParams]);

  // Aplicar filtros cuando cambian las selecciones
  useEffect(() => {
    applyFilters(activities, selectedCategories, sortType);
  }, [selectedCategories, sortType, activities]);

  // Función para aplicar filtros
  const applyFilters = (data, categories, sort) => {
    let filtered = [...data];
    
    // Filtrar por categorías
    if (categories.length > 0) {
      filtered = filtered.filter(item => 
        categories.includes(item.categoria?.nombre)
      );
    }
    
    // Aplicar ordenamiento
    switch (sort) {
      case "highPrice":
        filtered.sort((a, b) => b.valorTarifa - a.valorTarifa);
        break;
      case "lowPrice":
        filtered.sort((a, b) => a.valorTarifa - b.valorTarifa);
        break;
      case "relevance":
      default:
        filtered.sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0));
        break;
    }
    
    setFilteredActivities(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };
  
  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Manejar cambio de ordenamiento
  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };
  
  // Remover categoría seleccionada
  const removeCategory = (category) => {
    setSelectedCategories(prev => 
      prev.filter(cat => cat !== category)
    );
  };

  // Calcular actividades para la página actual
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Imagen por defecto en caso de error o sin imagen
  const defaultImage = "/activitie.webp";
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };
  
  return (
    <div className="filter-products-page">
      <header className="header-filter">
        <NavDash variant="standard" isLoggedIn={isLoggedIn} />
      </header>
      
      <div className="filter-container">
        <div className="filter-header">
          <h1 className="results-title">
            {filteredActivities.length} resultados de 
            {selectedCategories.length > 0 ? (
              <div className="selected-categories">
                {selectedCategories.map(cat => (
                  <span key={cat} className="category-tag">
                    {cat} <button onClick={() => removeCategory(cat)}>×</button>
                  </span>
                ))}
              </div>
            ) : (
              " todas las categorías"
            )}
          </h1>
          <div className="sort-container">
            <select value={sortType} onChange={handleSortChange} className="sort-select">
              <option value="relevance">Más relevantes</option>
              <option value="highPrice">Mayor precio</option>
              <option value="lowPrice">Menor precio</option>
            </select>
          </div>
        </div>
        
        <div className="filter-content">
          <div className="filter-sidebar">
            <h3>Filtrar por</h3>
            <div className="filter-section">
              <h4>Categorías</h4>
              <ul className="category-list">
                {categories.map(category => (
                  <li key={category.id}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category.nombre)}
                        onChange={() => {
                          if (selectedCategories.includes(category.nombre)) {
                            removeCategory(category.nombre);
                          } else {
                            setSelectedCategories([...selectedCategories, category.nombre]);
                          }
                        }}
                      />
                      {category.nombre}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="products-grid">
            {loading ? (
              <p className="loading-message">Cargando actividades...</p>
            ) : currentActivities.length > 0 ? (
              <div className="activities-container">
                {currentActivities.map(activity => (
                  <div key={activity.id} className="activity-card-container" onClick={() => navigate(`/actividad/${activity.id}`)}>
                    <div className="activity-card">
                      <div className="activity-image-container">
                        <img 
                          src={activity.imagenes && activity.imagenes.length > 0 
                            ? activity.imagenes[0].rutaImagen 
                            : defaultImage} 
                          alt={activity.nombre} 
                          className="activity-image"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="activity-content">
                        <h3 className="activity-title">{activity.nombre}</h3>
                        <div className="activity-details">
                          <span className="activity-location">
                            <FontAwesomeIcon icon={faMap} />
                            {activity.ubicacion || 'Ubicación no disponible'}
                          </span>
                          <span className="activity-duration">
                            {activity.tipoEvento === "FECHA_UNICA" ? (
                              <FontAwesomeIcon icon={faClock} />
                            ) : (
                              <FontAwesomeIcon icon={faCalendarAlt} />
                            )}
                            <DurationInfo
                              tipoEvento={activity.tipoEvento}
                              horaInicio={activity.horaInicio}
                              horaFin={activity.horaFin}
                              diasDisponible={activity.diasDisponible}
                            />
                          </span>
                        </div>
                        <div className="activity-footer">
                          <span className="activity-price">${activity.valorTarifa}</span>
                          <span className="activity-rating">
                            <FontAwesomeIcon icon={faStar} />
                            {activity.puntuacion || 4.5}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-results">No se encontraron actividades con los filtros seleccionados.</p>
            )}
            
            {filteredActivities.length > itemsPerPage && (
              <div className="pagination-container">
                <Pagination 
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="standard"
                  size="large"
                  shape="circular"
                  className="custom-pagination"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FilterProducts;
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import "../css/pages/FilterProducts.css";
import NavDash from "../components/NavDash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlus,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMap,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import DurationInfo from "../components/DurationInfo";

// MUI Components
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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
  const searchTermFromURL = searchParams.get("searchTerm") || "";

  useEffect(() => {
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [searchTermFromURL]);

  // Nuevos estados para filtros adicionales
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [ratingFilters, setRatingFilters] = useState({
    five: false,
    four: false,
    three: false,
  });
  const [durationFilters, setDurationFilters] = useState({
    upToOneHour: false,
    oneToFourHours: false,
    fourHoursToOneDay: false,
    oneDayToThreeDays: false,
    moreThanThreeDays: false,
  });
  const [languageFilters, setLanguageFilters] = useState({
    spanish: false,
    english: false,
  });

  // Para autocompletado
  const [searchOptions, setSearchOptions] = useState([]);

  // Tema personalizado para componentes MUI
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3E10DA",
      },
      secondary: {
        main: "#EEC52D",
      },
    },
  });

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

  // Cargar actividades (solo al inicio)
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

        // Crear opciones para el autocompletado
        const options = [];
        data.forEach((activity) => {
          if (activity.nombre)
            options.push({ label: activity.nombre, type: "nombre" });
          if (activity.ubicacion) {
            const parts = activity.ubicacion.split(", ");
            if (parts.length > 1) {
              options.push({ label: parts[0], type: "ciudad" });
              options.push({ label: parts[1], type: "pais" });
            } else {
              options.push({ label: activity.ubicacion, type: "ubicacion" });
            }
          }
        });

        // Eliminar duplicados
        const uniqueOptions = Array.from(
          new Set(options.map((opt) => opt.label))
        ).map((label) => options.find((opt) => opt.label === label));

        setSearchOptions(uniqueOptions);
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
    if (activities.length > 0) {
      applyFilters();
    }
  }, [
    activities,
    selectedCategories,
    sortType,
    searchTerm,
    selectedDate,
    priceRange,
    ratingFilters,
    durationFilters,
    languageFilters,
  ]);

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = [...activities];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por fecha (si se implementa en el backend)
    if (selectedDate) {
      // Implementar lógica para filtrar por fecha cuando esté disponible
    }

    // Filtrar por categorías
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => {
        // Si es un array de categorías
        if (Array.isArray(item.categorias)) {
          return item.categorias.some((cat) =>
            selectedCategories.includes(cat.nombre)
          );
        }
        // Si es una sola categoría en formato objeto
        else if (item.categoria && item.categoria.nombre) {
          return selectedCategories.includes(item.categoria.nombre);
        }
        // Si es una categoría en formato string
        else if (typeof item.categoria === "string") {
          return selectedCategories.includes(item.categoria);
        }
        return false;
      });
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(
      (item) =>
        item.valorTarifa >= priceRange[0] && item.valorTarifa <= priceRange[1]
    );

    // Filtrar por calificación
    const hasRatingFilter =
      ratingFilters.five || ratingFilters.four || ratingFilters.three;

    if (hasRatingFilter) {
      filtered = filtered.filter((item) => {
        // Usar 4.5 como valor por defecto ya que es el rating hardcodeado actual
        const rating = item.puntuacion || 4.5;

        return (
          (ratingFilters.five && rating >= 5) ||
          (ratingFilters.four && rating >= 4 && rating < 5) ||
          (ratingFilters.three && rating >= 3 && rating < 4)
        );
      });
    }

    // Filtrar por duración
    const hasDurationFilter = Object.values(durationFilters).some(Boolean);

    if (hasDurationFilter) {
      filtered = filtered.filter((item) => {
        let duration = 0;

        // Calcular duración en horas basado en horaInicio y horaFin
        if (item.horaInicio && item.horaFin) {
          const start = new Date(`2000-01-01T${item.horaInicio}`);
          const end = new Date(`2000-01-01T${item.horaFin}`);
          duration = (end - start) / (1000 * 60 * 60); // en horas

          if (end < start) {
            duration += 24; // Si termina al día siguiente
          }
        }

        return (
          (durationFilters.upToOneHour && duration <= 1) ||
          (durationFilters.oneToFourHours && duration > 1 && duration <= 4) ||
          (durationFilters.fourHoursToOneDay &&
            duration > 4 &&
            duration <= 24) ||
          (durationFilters.oneDayToThreeDays &&
            duration > 24 &&
            duration <= 72) ||
          (durationFilters.moreThanThreeDays && duration > 72)
        );
      });
    }

    // Filtrar por idioma (si está disponible)
    const hasLanguageFilter =
      languageFilters.spanish || languageFilters.english;

    if (hasLanguageFilter && activities.some((item) => item.idioma)) {
      filtered = filtered.filter((item) => {
        if (!item.idioma) return false;

        const idioma = item.idioma.toLowerCase(); // Normalizar el idioma a minúsculas
        return (
          (languageFilters.spanish &&
            (idioma === "español" ||
              idioma === "espanol" ||
              idioma === "spanish")) ||
          (languageFilters.english &&
            (idioma === "inglés" ||
              idioma === "ingles" ||
              idioma === "english"))
        );
      });
    }

    // Aplicar ordenamiento
    switch (sortType) {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Manejar cambio de ordenamiento
  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  // Remover categoría seleccionada
  const removeCategory = (category) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
  };

  // Toggle categoría
  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      removeCategory(categoryName);
    } else {
      setSelectedCategories((prev) => [...prev, categoryName]);
    }
  };

  // Manejar cambio en filtro de calificación
  const handleRatingFilterChange = (filter) => {
    setRatingFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Manejar cambio en filtro de duración
  const handleDurationFilterChange = (filter) => {
    setDurationFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Manejar cambio en filtro de idioma
  const handleLanguageFilterChange = (filter) => {
    setLanguageFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Función para restablecer todos los filtros a sus valores iniciales
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setPriceRange([0, 10000]);
    setRatingFilters({
      five: false,
      four: false,
      three: false,
    });
    setDurationFilters({
      upToOneHour: false,
      oneToFourHours: false,
      fourHoursToOneDay: false,
      oneDayToThreeDays: false,
      moreThanThreeDays: false,
    });
    setLanguageFilters({
      spanish: false,
      english: false,
    });
    setSelectedCategories([]);
    setSortType("relevance");
    setCurrentPage(1);
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
    <ThemeProvider theme={theme}>
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
                  {selectedCategories.map((cat) => (
                    <span key={cat} className="category-tag">
                      {cat}{" "}
                      <button onClick={() => removeCategory(cat)}>×</button>
                    </span>
                  ))}
                </div>
              ) : (
                " todas las categorías"
              )}
            </h1>
            <div className="sort-container">
              <select
                value={sortType}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="relevance">Más relevantes</option>
                <option value="highPrice">Mayor precio</option>
                <option value="lowPrice">Menor precio</option>
              </select>
            </div>
          </div>

          <div className="filter-content">
            <div className="filter-sidebar">
              <div className="filter-header-section">
                <h3>Filtrar por</h3>
                <button
                  className="reset-filters-btn"
                  onClick={handleResetFilters}
                >
                  Limpiar
                </button>
              </div>

              {/* Campo de búsqueda */}
              <div className="filter-section">
                <h4>Búsqueda</h4>
                <Autocomplete
                  freeSolo
                  id="search-autocomplete"
                  options={searchOptions}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.label
                  }
                  onChange={(event, value) =>
                    setSearchTerm(
                      value
                        ? typeof value === "string"
                          ? value
                          : value.label
                        : ""
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Buscar actividades"
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <FontAwesomeIcon
                            icon={faSearch}
                            style={{ marginRight: 8, color: "#3E10DA" }}
                          />
                        ),
                      }}
                    />
                  )}
                  className="search-field"
                />
              </div>

              {/* Campo de fecha */}
              <div className="filter-section">
                <h4>Fecha</h4>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Seleccionar fecha"
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    renderInput={(params) => (
                      <TextField {...params} size="small" fullWidth />
                    )}
                    className="date-picker"
                  />
                </LocalizationProvider>
              </div>

              {/* Campo de categorías */}
              <div className="filter-section">
                <h4>Categorías</h4>
                <div className="category-bubbles">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`category-bubble ${
                        selectedCategories.includes(category.nombre)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => toggleCategory(category.nombre)}
                    >
                      {category.nombre}
                      {selectedCategories.includes(category.nombre) ? (
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="category-icon"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="category-icon"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Campo de rango de precio */}
              <div className="filter-section">
                <h4>Precio</h4>
                <Box className="price-slider-container">
                  <Slider
                    value={priceRange}
                    onChange={(event, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
                    color="primary"
                  />
                  <div className="price-range-labels">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </Box>
              </div>

              {/* Campo de calificación */}
              <div className="filter-section">
                <h4>Calificación</h4>
                <div className="rating-filters">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ratingFilters.five}
                        onChange={() => handleRatingFilterChange("five")}
                        name="five-stars"
                        color="primary"
                      />
                    }
                    label={
                      <div className="rating-label">
                        <Rating value={5} readOnly size="small" />
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ratingFilters.four}
                        onChange={() => handleRatingFilterChange("four")}
                        name="four-stars"
                        color="primary"
                      />
                    }
                    label={
                      <div className="rating-label">
                        <Rating value={4} readOnly size="small" />
                      </div>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ratingFilters.three}
                        onChange={() => handleRatingFilterChange("three")}
                        name="three-stars"
                        color="primary"
                      />
                    }
                    label={
                      <div className="rating-label">
                        <Rating value={3} readOnly size="small" />
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Campo de duración */}
              <div className="filter-section">
                <h4>Duración</h4>
                <div className="duration-filters">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={durationFilters.upToOneHour}
                        onChange={() =>
                          handleDurationFilterChange("upToOneHour")
                        }
                        name="up-to-one-hour"
                        color="primary"
                      />
                    }
                    label="Hasta 1 hora"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={durationFilters.oneToFourHours}
                        onChange={() =>
                          handleDurationFilterChange("oneToFourHours")
                        }
                        name="one-to-four-hours"
                        color="primary"
                      />
                    }
                    label="1 a 4 horas"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={durationFilters.fourHoursToOneDay}
                        onChange={() =>
                          handleDurationFilterChange("fourHoursToOneDay")
                        }
                        name="four-hours-to-one-day"
                        color="primary"
                      />
                    }
                    label="4 horas a 1 día"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={durationFilters.oneDayToThreeDays}
                        onChange={() =>
                          handleDurationFilterChange("oneDayToThreeDays")
                        }
                        name="one-day-to-three-days"
                        color="primary"
                      />
                    }
                    label="1 día a 3 días"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={durationFilters.moreThanThreeDays}
                        onChange={() =>
                          handleDurationFilterChange("moreThanThreeDays")
                        }
                        name="more-than-three-days"
                        color="primary"
                      />
                    }
                    label="+3 días"
                  />
                </div>
              </div>

              {/* Campo de idioma */}
              <div className="filter-section">
                <h4>Idioma</h4>
                <div className="language-filters">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={languageFilters.spanish}
                        onChange={() => handleLanguageFilterChange("spanish")}
                        name="spanish"
                        color="primary"
                      />
                    }
                    label="Español"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={languageFilters.english}
                        onChange={() => handleLanguageFilterChange("english")}
                        name="english"
                        color="primary"
                      />
                    }
                    label="Inglés"
                  />
                </div>
              </div>
            </div>

            {/* Contenido principal (actividades) */}
            <div className="products-grid">
              {/* El resto del código de actividades permanece igual */}
              {loading ? (
                <p className="loading-message">Cargando actividades...</p>
              ) : currentActivities.length > 0 ? (
                <div className="activities-container">
                  {currentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="activity-card-container"
                      onClick={() => navigate(`/actividad/${activity.id}`)}
                    >
                      {/* Contenido de las cards (mantiene el mismo) */}
                      <div className="activity-card">
                        <div className="activity-image-container">
                          <img
                            src={
                              activity.productoImagenesSalidaDto?.[0]
                                ?.rutaImagen || "/activitie.webp"
                            }
                            alt={activity.nombre}
                            className="activity-image"
                            onError={handleImageError}
                          />
                          {/* <div className="container_card_category">
                            {categories?.length > 0 && (
                              <span className="card-category">
                                {activity.categorias[0].nombre}
                              </span>
                            )}
                          </div> */}
                        </div>
                        <div className="activity-content">
                          <h3 className="activity-title">{activity.nombre}</h3>
                          <div className="activity-details">
                            <span className="activity-location">
                              <FontAwesomeIcon icon={faMap} />
                              {activity.ubicacion || "Ubicación no disponible"}
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
                            <span className="activity-price">
                              ${activity.valorTarifa}
                            </span>
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
                <p className="no-results">
                  No se encontraron actividades con los filtros seleccionados.
                </p>
              )}

              {/* Paginación */}
              {filteredActivities.length > itemsPerPage && (
                <div className="pagination-container">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    shape="circular"
                    className="custom-pagination"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FilterProducts;

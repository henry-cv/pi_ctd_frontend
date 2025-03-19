import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/pages/FilterProducts.css";
import NavDash from "../components/NavDash";
import FilterHeader from "../components/FilterHeader";
import FilterSidebar from "../components/FilterSidebar";
import ProductsGrid from "../components/ProductsGrid";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Sistema de caché global
if (!window.apiCache) {
  window.apiCache = {
    categories: null,
    products: null,
    suggestions: {},
    lastApiCall: {},
    minCallInterval: 500
  };
}

const apiCache = window.apiCache;

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
  const [isLoggedIn] = useState(false);
  const searchTermFromURL = searchParams.get("searchTerm") || "";
  const isInitialMount = useRef(true);
  const dataLoaded = useRef(false);
  const searchTimeout = useRef(null);
  const activeSearchTerm = useRef("");
  const isFilteringRef = useRef(false);

  // Estados para filtros
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

  // Función de utilidad para verificar si una llamada API debe realizarse
  const shouldMakeApiCall = (endpoint) => {
    const now = Date.now();
    const lastCall = apiCache.lastApiCall[endpoint] || 0;
    
    if (now - lastCall < apiCache.minCallInterval) {
      return false;
    }
    
    apiCache.lastApiCall[endpoint] = now;
    return true;
  };

  // Set search term from URL on initial mount only
  useEffect(() => {
    if (isInitialMount.current && searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
      isInitialMount.current = false;
    }
  }, [searchTermFromURL]);

  // Fetch data function with cache
  const fetchData = useCallback(async () => {
    if (dataLoaded.current) return;
    
    try {
      setLoading(true);
      
      // Fetch categories using cache
      let categoriesData;
      if (apiCache.categories) {
        categoriesData = apiCache.categories;
      } else {
        if (!shouldMakeApiCall('/api/categoria/listar')) return;
        
        const categoriesResponse = await fetch("/api/categoria/listar");
        if (!categoriesResponse.ok) {
          throw new Error("Error al obtener categorías");
        }
        categoriesData = await categoriesResponse.json();
        apiCache.categories = categoriesData;
      }
      setCategories(categoriesData);
      
      // Fetch activities using cache
      let activitiesData;
      if (apiCache.products) {
        activitiesData = apiCache.products;
      } else {
        if (!shouldMakeApiCall('/api/producto/listar')) return;
        
        const activitiesResponse = await fetch("/api/producto/listar");
        if (!activitiesResponse.ok) {
          throw new Error("Error al obtener actividades");
        }
        activitiesData = await activitiesResponse.json();
        apiCache.products = activitiesData;
      }
      
      setActivities(activitiesData);
      setFilteredActivities(activitiesData);
      
      // Set initial suggestions
      const initialOptions = activitiesData.slice(0, 10).map((activity) => ({
        label: activity.nombre,
        id: activity.id,
        categorias: activity.categorias || [],
      }));
      setSearchOptions(initialOptions);
      
      // Get category from URL parameter if any
      const categoryParam = searchParams.get("categoria");
      if (categoryParam) {
        const categoriesFromUrl = categoryParam.split(",");
        setSelectedCategories(categoriesFromUrl);
      }
      
      dataLoaded.current = true;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search suggestions
  const fetchSearchSuggestions = useCallback((query) => {
    // Skip if no query or less than 2 chars
    if (!query || query.trim().length < 2) return;
    
    // Skip if already searching for this exact query
    if (activeSearchTerm.current === query) return;
    
    // Check cache first
    if (apiCache.suggestions[query]) {
      setSearchOptions(apiCache.suggestions[query]);
      return;
    }
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout
    searchTimeout.current = setTimeout(async () => {
      try {
        if (isFilteringRef.current) return; // Skip if already filtering
        
        const endpoint = `/api/producto/filtrar?query=${encodeURIComponent(query)}`;
        if (!shouldMakeApiCall(endpoint)) return;
        
        activeSearchTerm.current = query;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al filtrar productos");
        const data = await response.json();
        
        // Format options with label for Autocomplete
        const formattedOptions = data.map((activity) => ({
          label: activity.nombre,
          id: activity.id,
          categorias: activity.categorias || [],
        }));
        
        // Save to cache
        apiCache.suggestions[query] = formattedOptions;
        setSearchOptions(formattedOptions);
        
        if (activeSearchTerm.current === query) {
          activeSearchTerm.current = "";
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        activeSearchTerm.current = "";
      }
    }, 300);
  }, []);

  // Apply filters - only called when needed
  const applyFilters = useCallback(async () => {
    if (!dataLoaded.current || activities.length === 0 || isFilteringRef.current) return;
    
    isFilteringRef.current = true;
    setLoading(true);
    let filtered = [...activities];

    // Filtrar por término de búsqueda
    if (searchTerm && searchTerm.trim().length >= 2) {
      // Check cache
      if (apiCache.suggestions[searchTerm]) {
        const suggestionIds = apiCache.suggestions[searchTerm].map(opt => opt.id);
        filtered = filtered.filter(item => suggestionIds.includes(item.id));
      } else {
        try {
          const endpoint = `/api/producto/filtrar?query=${encodeURIComponent(searchTerm)}`;
          if (!shouldMakeApiCall(endpoint)) {
            isFilteringRef.current = false;
            setLoading(false);
            return;
          }
          
          const response = await fetch(endpoint);
          if (!response.ok) throw new Error("Error al filtrar productos");
          filtered = await response.json();
          
          // Cache suggestions for future use
          const suggestions = filtered.map(activity => ({
            label: activity.nombre,
            id: activity.id,
            categorias: activity.categorias || [],
          }));
          apiCache.suggestions[searchTerm] = suggestions;
          
          if (searchTerm === activeSearchTerm.current || !activeSearchTerm.current) {
            setSearchOptions(suggestions);
          }
        } catch (error) {
          console.error("Error filtering products:", error);
          filtered = [];
        }
      }
    }

    // Filtrar por fecha
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

    // Filtrar por idioma
    const hasLanguageFilter =
      languageFilters.spanish || languageFilters.english;

    if (hasLanguageFilter && activities.some((item) => item.idioma)) {
      filtered = filtered.filter((item) => {
        if (!item.idioma) return false;

        const idioma = item.idioma.toLowerCase();
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
    setLoading(false);
    isFilteringRef.current = false;
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

  // Prevenir múltiples actualizaciones usando un debounce
  const debouncedApplyFilters = useCallback(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      applyFilters();
    }, 100);
  }, [applyFilters]);

  // Only reapply filters when filter values change and data is loaded
  useEffect(() => {
    if (dataLoaded.current && !isFilteringRef.current) {
      debouncedApplyFilters();
    }
  }, [
    debouncedApplyFilters,
    selectedCategories,
    sortType,
    searchTerm,
    selectedDate,
    priceRange,
    ratingFilters,
    durationFilters,
    languageFilters,
  ]);

  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Manejar cambio en campo de búsqueda
  const handleSearchChange = (event, newValue) => {
    if (searchTerm === newValue) return; // Evitar actualizaciones innecesarias
    
    setSearchTerm(newValue);
    
    // No hacer nada para búsquedas vacías o muy cortas
    if (!newValue || newValue.trim().length < 2) {
      // Restaurar opciones iniciales si hay datos
      if (apiCache.products) {
        const initialOptions = apiCache.products.slice(0, 10).map((activity) => ({
          label: activity.nombre,
          id: activity.id,
          categorias: activity.categorias || [],
        }));
        setSearchOptions(initialOptions);
      }
      return;
    }
    
    // Fetch suggestions for 2+ character queries
    fetchSearchSuggestions(newValue);
  };

  // Función para restablecer todos los filtros
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
    activeSearchTerm.current = "";
    
    // Restaurar opciones iniciales
    if (apiCache.products) {
      const initialOptions = apiCache.products.slice(0, 10).map((activity) => ({
        label: activity.nombre,
        id: activity.id,
        categorias: activity.categorias || [],
      }));
      setSearchOptions(initialOptions);
    }
  };

  // Calcular actividades para la página actual
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="filter-products-page">
        <header className="header-filter">
          <NavDash variant="standard" isLoggedIn={isLoggedIn} />
        </header>

        <div className="filter-container">
          <FilterHeader 
            filteredActivities={filteredActivities}
            selectedCategories={selectedCategories}
            removeCategory={removeCategory}
            sortType={sortType}
            setSortType={setSortType}
          />

          <div className="filter-content">
            <FilterSidebar
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              searchOptions={searchOptions}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              ratingFilters={ratingFilters}
              handleRatingFilterChange={handleRatingFilterChange}
              durationFilters={durationFilters}
              handleDurationFilterChange={handleDurationFilterChange}
              languageFilters={languageFilters}
              handleLanguageFilterChange={handleLanguageFilterChange}
              handleResetFilters={handleResetFilters}
            />

            <ProductsGrid
              loading={loading}
              dataLoaded={dataLoaded.current}
              currentActivities={currentActivities}
              filteredActivities={filteredActivities}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FilterProducts;
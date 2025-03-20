// src/pages/FilterProducts.jsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "../css/pages/FilterProducts.css";
import NavDash from "../components/NavDash";
import FilterHeader from "../components/FilterHeader";
import FilterSidebar from "../components/FilterSidebar";
import ProductsGrid from "../components/ProductsGrid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useActivitiesData } from "../hooks/useActivitiesData";
import { loadSingleDateAvailabilities, checkAvailabilityInRange } from "../services/availabilityService";
import dayjs from "dayjs";
import 'dayjs/locale/es';

// Configurar dayjs
dayjs.locale('es');

// Asegurar que el caché global está configurado
if (!window.apiCache) {
  window.apiCache = {
    categories: null,
    products: null,
    suggestions: {},
    lastApiCall: {},
    minCallInterval: 500,
    noResultsTerms: new Set(),
    activePromises: {}
  };
}

const FilterProducts = () => {
  const [searchParams] = useSearchParams();
  const searchTermFromURL = searchParams.get("searchTerm") || "";
  const categoryParam = searchParams.get("categoria");
  const initialCategories = categoryParam ? categoryParam.split(",") : [];
  
  // MUI theme
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

  // Get data from custom hook
  const {
    activities,
    categories,
    searchOptions,
    loading: dataLoading,
    dataLoaded,
    fetchSearchSuggestions,
  } = useActivitiesData(searchTermFromURL);

  // Estado para guardar datos de disponibilidad
  const [availabilityData, setAvailabilityData] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Filter state management
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [sortType, setSortType] = useState("relevance");
  const [searchTerm, setSearchTerm] = useState(searchTermFromURL);
  const [dateRange, setDateRange] = useState([null, null]);
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Estado para las actividades filtradas
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filterLoading, setFilterLoading] = useState(false);

  // Cargar datos de disponibilidad para actividades de fecha única
  useEffect(() => {
    const loadAvailability = async () => {
      if (!activities || activities.length === 0) return;
      
      const singleDateActivities = activities.filter(act => act.tipoEvento === 'FECHA_UNICA');
      
      if (singleDateActivities.length === 0) return;
      
      setLoadingAvailability(true);
      
      try {
        console.log(`Cargando disponibilidad para ${singleDateActivities.length} actividades de fecha única...`);
        const availabilityResults = await loadSingleDateAvailabilities(singleDateActivities);
        
        // Convertir a un objeto indexado por id de actividad
        const availabilityMap = {};
        availabilityResults.forEach(({ activity, availability }) => {
          availabilityMap[activity.id] = availability;
        });
        
        setAvailabilityData(availabilityMap);
        console.log("Disponibilidad cargada:", availabilityMap);
      } catch (error) {
        console.error("Error al cargar datos de disponibilidad:", error);
      } finally {
        setLoadingAvailability(false);
      }
    };
    
    loadAvailability();
  }, [activities]);

  // Función para aplicar todos los filtros
  const applyFilters = useCallback(async () => {
    console.log("Aplicando filtros...");
    setFilterLoading(true);
    
    let result = [...activities];
    console.log(`Total de actividades: ${result.length}`);
    
    // Filtrar por búsqueda
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(activity => 
        activity.nombre.toLowerCase().includes(term) ||
        (activity.descripcion && activity.descripcion.toLowerCase().includes(term))
      );
      console.log(`Después de filtrado por término "${term}": ${result.length}`);
    }
    
    // Filtrar por categorías
    if (selectedCategories.length > 0) {
      result = result.filter(activity => {
        if (!activity.categorias) return false;
        return activity.categorias.some(cat => 
          selectedCategories.includes(cat.nombre)
        );
      });
      console.log(`Después de filtrado por categorías: ${result.length}`);
    }
    
    // Filtrar por rango de fechas
    if (dateRange[0] && dateRange[1]) {
      console.log("Filtrando por fechas:", dateRange[0].format('YYYY-MM-DD'), "a", dateRange[1].format('YYYY-MM-DD'));
      
      // Para cada actividad, verificar disponibilidad en rango
      const availabilityPromises = result.map(activity => 
        checkAvailabilityInRange(
          activity, 
          dateRange, 
          activity.tipoEvento === 'FECHA_UNICA' ? availabilityData[activity.id] : null
        )
      );
      
      const availabilityResults = await Promise.all(availabilityPromises);
      
      // Filtrar actividades basado en resultados de disponibilidad
      result = result.filter((_, index) => availabilityResults[index]);
      
      console.log(`Después de filtrado por fechas: ${result.length}`);
    }
    
    // Filtrar por precio
    result = result.filter(
      (item) =>
        item.valorTarifa >= priceRange[0] && item.valorTarifa <= priceRange[1]
    );
    console.log(`Después de filtrado por precio: ${result.length}`);
    
    // Aplicar otros filtros...
    
    // Ordenar resultados
    switch (sortType) {
      case "highPrice":
        result.sort((a, b) => b.valorTarifa - a.valorTarifa);
        break;
      case "lowPrice":
        result.sort((a, b) => a.valorTarifa - b.valorTarifa);
        break;
      case "relevance":
      default:
        result.sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0));
        break;
    }
    
    // Actualizar estado
    setFilteredActivities(result);
    setTotalPages(Math.max(1, Math.ceil(result.length / itemsPerPage)));
    setFilterLoading(false);
  }, [activities, searchTerm, selectedCategories, dateRange, priceRange, ratingFilters, durationFilters, languageFilters, sortType, itemsPerPage, availabilityData]);
  
  // Aplicar filtros cuando cambian los datos o los criterios de filtrado
  useEffect(() => {
    if (activities.length > 0) {
      applyFilters();
    }
  }, [activities, searchTerm, selectedCategories, dateRange, priceRange, ratingFilters, durationFilters, languageFilters, sortType, applyFilters, availabilityData]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle search change with debouncing
  const handleSearchChange = (event, newValue) => {
    if (searchTerm === newValue) return;
    setSearchTerm(newValue);
    
    if (newValue && newValue.trim().length >= 2) {
      fetchSearchSuggestions(newValue);
    }
  };

  // Toggle category selection
  const toggleCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Remove a single category
  const removeCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.filter((cat) => cat !== categoryName)
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDateRange([null, null]);
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

  // Calculate activities for current page
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Debug para fechas
  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      console.log("Rango de fechas actualizado:", 
        dateRange[0].format('YYYY-MM-DD'), 
        "a", 
        dateRange[1].format('YYYY-MM-DD')
      );
    }
  }, [dateRange]);

  return (
    <ThemeProvider theme={theme}>
      <div className="filter-products-page">
        <header className="header-filter">
          <NavDash variant="standard" isLoggedIn={false} />
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
              dateRange={dateRange}
              setDateRange={setDateRange}
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              ratingFilters={ratingFilters}
              handleRatingFilterChange={(filterName) => {
                setRatingFilters(prev => ({
                  ...prev,
                  [filterName]: !prev[filterName]
                }));
              }}
              durationFilters={durationFilters}
              handleDurationFilterChange={(filterName) => {
                setDurationFilters(prev => ({
                  ...prev,
                  [filterName]: !prev[filterName]
                }));
              }}
              languageFilters={languageFilters}
              handleLanguageFilterChange={(filterName) => {
                setLanguageFilters(prev => ({
                  ...prev,
                  [filterName]: !prev[filterName]
                }));
              }}
              handleResetFilters={handleResetFilters}
            />

            <ProductsGrid
              loading={dataLoading || filterLoading || loadingAvailability}
              dataLoaded={dataLoaded}
              currentActivities={currentActivities}
              filteredActivities={filteredActivities}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FilterProducts;
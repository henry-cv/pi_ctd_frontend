import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faTicket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "../css/components/SearchBox.css";
import SelectCategoryBox from "./SelectCategoryBox";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Asegurar que el caché global está configurado
if (!window.apiCache) {
  window.apiCache = {
    categories: null,
    products: null,
    suggestions: {},
    // Registro de tiempo de la última llamada a cada endpoint
    lastApiCall: {},
    // Mínimo tiempo entre llamadas al mismo endpoint (ms)
    minCallInterval: 500
  };
}

const apiCache = window.apiCache;

const SearchBox = () => {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const dataInitialized = useRef(false);
  const searchTimeout = useRef(null);
  const activeSearchTerm = useRef("");

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

  // Función para cargar datos con cache
  const fetchInitialData = useCallback(async () => {
    if (dataInitialized.current) return;
    
    try {
      // Cargar categorías desde cache o API
      let categoriesData;
      if (apiCache.categories) {
        categoriesData = apiCache.categories;
      } else {
        const endpoint = '/api/categoria/listar';
        if (!shouldMakeApiCall(endpoint)) return;
        
        const categoriesResponse = await fetch(endpoint);
        if (!categoriesResponse.ok) {
          throw new Error("Error al obtener categorías");
        }
        categoriesData = await categoriesResponse.json();
        apiCache.categories = categoriesData;
      }
      setCategories(categoriesData);
      
      // Cargar productos iniciales desde cache o API
      let productsData;
      if (apiCache.products) {
        productsData = apiCache.products;
      } else {
        const endpoint = '/api/producto/listar';
        if (!shouldMakeApiCall(endpoint)) return;
        
        const productsResponse = await fetch(endpoint);
        if (!productsResponse.ok) {
          throw new Error("Error al obtener actividades iniciales");
        }
        productsData = await productsResponse.json();
        apiCache.products = productsData;
      }
      
      // Configurar opciones iniciales
      const initialOptions = productsData.slice(0, 10).map((activity) => ({
        label: activity.nombre,
        id: activity.id,
        categorias: activity.categorias || [],
      }));
      
      setOptions(initialOptions);
      dataInitialized.current = true;
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }, []);

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Función para buscar sugerencias con debounce
  const fetchSearchSuggestions = useCallback((query) => {
    // No hacer nada si la consulta es vacía o muy corta
    if (!query || query.trim().length < 2) {
      // Restaurar opciones iniciales
      if (apiCache.products) {
        const initialOptions = apiCache.products.slice(0, 10).map((activity) => ({
          label: activity.nombre,
          id: activity.id,
          categorias: activity.categorias || [],
        }));
        setOptions(initialOptions);
      }
      return;
    }
    
    // Evitar búsquedas duplicadas
    if (activeSearchTerm.current === query) return;
    
    // Usar cache si existe
    if (apiCache.suggestions[query]) {
      setOptions(apiCache.suggestions[query]);
      return;
    }
    
    // Limpiar timeout previo
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Configurar nuevo timeout para debounce
    searchTimeout.current = setTimeout(async () => {
      try {
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
        
        // Guardar en cache
        apiCache.suggestions[query] = formattedOptions;
        
        // Solo actualizar si sigue siendo el término activo
        if (activeSearchTerm.current === query) {
          setOptions(formattedOptions);
          activeSearchTerm.current = "";
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        activeSearchTerm.current = "";
      }
    }, 300); // 300ms delay
  }, []);

  // Manejar cambio de entrada de búsqueda
  const handleInputChange = (event, newValue) => {
    if (inputValue === newValue) return; // Evitar actualizaciones repetidas
    
    setInputValue(newValue);
    fetchSearchSuggestions(newValue);
  };

  const handleActivitySelect = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      setInputValue(newValue.label);

      // Set the category from the selected option if available
      setSelectedCategory(
        newValue.categorias?.length > 0 ? newValue.categorias[0].nombre : ""
      );
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (inputValue.trim() !== "") {
      searchParams.append("searchTerm", inputValue);
    }
    
    if (selectedCategory.trim() !== "") {
      searchParams.append("categoria", selectedCategory);
    }
    
    if (selectedDate) {
      searchParams.append("fecha", selectedDate);
    }
    
    navigate(`/actividades?${searchParams.toString()}`);
  };

  return (
    <div className="search-box-container">
      <div className="search-box-wrapper">
        <div className="search-fields">
          {/* Campo de Destino con Autocomplete */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faLocationDot} />
              <div className="title-input-search">
                <span>Buscar actividades</span>
                <Autocomplete
                  freeSolo
                  options={options}
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Ej: Taller de fotografía"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{
                        ml: "-13px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { border: "none" },
                        },
                      }}
                      InputProps={{ 
                        ...params.InputProps, 
                        endAdornment: null,
                      }}
                    />
                  )}
                  onChange={handleActivitySelect}
                  openOnFocus={true}
                  blurOnSelect={false}
                />
              </div>
            </div>
          </div>

          {/* Campo de Categoría */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faTicket} rotation={90} />
              <div className="title-input-search">
                <span>Categoría</span>
                <SelectCategoryBox
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            </div>
          </div>

          {/* Campo de Fecha */}
          <div className="search-field">
            <div className="field-title">
              <FontAwesomeIcon icon={faCalendarDays} />
              <div className="title-input-search">
                <span>Fecha</span>
                <input 
                  type="date" 
                  min={today} 
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          className="search-button"
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
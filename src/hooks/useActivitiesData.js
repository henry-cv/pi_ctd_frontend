// src/hooks/useActivitiesData.js
import { useState, useEffect, useRef, useCallback } from "react";

// API cache configuration
const API_CACHE = {
  categories: null,
  products: null,
  suggestions: {},
  lastApiCall: {},
  minCallInterval: 500
};

export const useActivitiesData = (initialSearchTerm = "") => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoaded = useRef(false);
  const searchTimeout = useRef(null);
  const activeSearchTerm = useRef("");

  // Check if API call should be made (rate limiting)
  const shouldMakeApiCall = useCallback((endpoint) => {
    const now = Date.now();
    const lastCall = API_CACHE.lastApiCall[endpoint] || 0;
    
    if (now - lastCall < API_CACHE.minCallInterval) {
      return false;
    }
    
    API_CACHE.lastApiCall[endpoint] = now;
    return true;
  }, []);

  // Fetch initial data (categories and activities)
  const fetchInitialData = useCallback(async () => {
    if (dataLoaded.current) return;
    
    try {
      setLoading(true);
      
      // Fetch categories (from cache or API)
      let categoriesData;
      if (API_CACHE.categories) {
        categoriesData = API_CACHE.categories;
      } else {
        const endpoint = '/api/categoria/listar';
        if (!shouldMakeApiCall(endpoint)) return;
        
        const categoriesResponse = await fetch(endpoint);
        if (!categoriesResponse.ok) {
          throw new Error("Error al obtener categorías");
        }
        categoriesData = await categoriesResponse.json();
        API_CACHE.categories = categoriesData;
      }
      setCategories(categoriesData);
      
      // Fetch activities (from cache or API)
      let activitiesData;
      if (API_CACHE.products) {
        activitiesData = API_CACHE.products;
      } else {
        const endpoint = '/api/producto/listar';
        if (!shouldMakeApiCall(endpoint)) return;
        
        const activitiesResponse = await fetch(endpoint);
        if (!activitiesResponse.ok) {
          throw new Error("Error al obtener actividades");
        }
        activitiesData = await activitiesResponse.json();
        API_CACHE.products = activitiesData;
      }
      
      setActivities(activitiesData);
      
      // Set initial search options
      const initialOptions = activitiesData.slice(0, 10).map((activity) => ({
        label: activity.nombre,
        id: activity.id,
        categorias: activity.categorias || [],
      }));
      
      setSearchOptions(initialOptions);
      
      // If initial search term is provided, fetch suggestions
      if (initialSearchTerm && initialSearchTerm.trim().length >= 2) {
        fetchSearchSuggestions(initialSearchTerm);
      }
      
      dataLoaded.current = true;
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  }, [initialSearchTerm, shouldMakeApiCall]);

  // Fetch search suggestions with debounce
  const fetchSearchSuggestions = useCallback((query) => {
    if (!query || query.trim().length < 2) {
      // Restore initial options if data is loaded
      if (API_CACHE.products) {
        const initialOptions = API_CACHE.products.slice(0, 10).map((activity) => ({
          label: activity.nombre,
          id: activity.id,
          categorias: activity.categorias || [],
        }));
        setSearchOptions(initialOptions);
      }
      return;
    }
    
    const trimmedQuery = query.trim();
    
    // Verificar si el término actual comienza con algún prefijo sin resultados conocido
    const globalNoResultsTerms = window.apiCache?.noResultsTerms;
    if (globalNoResultsTerms) {
      for (const noResultTerm of globalNoResultsTerms) {
        if (trimmedQuery.startsWith(noResultTerm)) {
          console.log(`[Sugerencias] Omitiendo búsqueda para "${trimmedQuery}" porque "${noResultTerm}" ya no tuvo resultados`);
          setSearchOptions([]);
          return;
        }
      }
    }
    
    // Skip if already searching for this query
    if (activeSearchTerm.current === trimmedQuery) return;
    
    // Use cache if available
    if (API_CACHE.suggestions[trimmedQuery]) {
      setSearchOptions(API_CACHE.suggestions[trimmedQuery]);
      return;
    }
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Set new timeout for debounce
    searchTimeout.current = setTimeout(async () => {
      try {
        const endpoint = `/api/producto/filtrar?query=${encodeURIComponent(trimmedQuery)}`;
        if (!shouldMakeApiCall(endpoint)) return;
        
        activeSearchTerm.current = trimmedQuery;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al filtrar productos");
        const data = await response.json();
        
        // Format options for Autocomplete
        const formattedOptions = data.map((activity) => ({
          label: activity.nombre,
          id: activity.id,
          categorias: activity.categorias || [],
        }));
        
        // Save to cache
        API_CACHE.suggestions[trimmedQuery] = formattedOptions;
        
        // Si no hay resultados, agregar al conjunto global de términos sin resultados
        if (data.length === 0 && window.apiCache) {
          window.apiCache.noResultsTerms = window.apiCache.noResultsTerms || new Set();
          window.apiCache.noResultsTerms.add(trimmedQuery);
        }
        
        // Only update if this is still the active query
        if (activeSearchTerm.current === trimmedQuery) {
          setSearchOptions(formattedOptions);
          activeSearchTerm.current = "";
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        activeSearchTerm.current = "";
      }
    }, 300);
  }, [shouldMakeApiCall]);

  // Fetch initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    activities,
    categories,
    searchOptions,
    loading,
    dataLoaded: dataLoaded.current,
    fetchSearchSuggestions,
  };
};
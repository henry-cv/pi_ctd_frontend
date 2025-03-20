// src/hooks/useActivitiesFilter.js
import { useState, useEffect, useRef, useCallback } from "react";
import { searchProducts } from "../services/apiService";

export const useActivitiesFilter = ({
  activities,
  searchTerm,
  selectedCategories,
  selectedDate,
  priceRange,
  ratingFilters,
  durationFilters,
  languageFilters,
  sortType,
  itemsPerPage,
  dataLoaded,
}) => {
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const isFilteringRef = useRef(false);
  const filterTimeoutRef = useRef(null);
  const lastSearchTermRef = useRef("");
  
  // Función para buscar usando la API (ahora usa el servicio compartido)
  const searchByApi = useCallback(async (query) => {
    return await searchProducts(query);
  }, []);
  
  // Función para aplicar todos los filtros excepto búsqueda
  const applyOtherFilters = useCallback((items) => {
    if (!items || !items.length) return [];
    
    let result = [...items];
    
    // Filtrar por categorías
    if (selectedCategories.length > 0) {
      result = result.filter((item) => {
        if (Array.isArray(item.categorias)) {
          return item.categorias.some((cat) =>
            selectedCategories.includes(cat.nombre)
          );
        } else if (item.categoria && item.categoria.nombre) {
          return selectedCategories.includes(item.categoria.nombre);
        } else if (typeof item.categoria === "string") {
          return selectedCategories.includes(item.categoria);
        }
        return false;
      });
    }
    
    // Filtrar por rango de precio
    result = result.filter(
      (item) =>
        item.valorTarifa >= priceRange[0] && item.valorTarifa <= priceRange[1]
    );
    
    // Filtrar por calificación
    const hasRatingFilter = Object.values(ratingFilters).some(Boolean);
    if (hasRatingFilter) {
      result = result.filter((item) => {
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
      result = result.filter((item) => {
        let duration = 0;
        
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
          (durationFilters.fourHoursToOneDay && duration > 4 && duration <= 24) ||
          (durationFilters.oneDayToThreeDays && duration > 24 && duration <= 72) ||
          (durationFilters.moreThanThreeDays && duration > 72)
        );
      });
    }
    
    // Filtrar por idioma
    const hasLanguageFilter = languageFilters.spanish || languageFilters.english;
    if (hasLanguageFilter) {
      result = result.filter((item) => {
        if (!item.idioma) return false;
        
        const idioma = item.idioma.toLowerCase();
        return (
          (languageFilters.spanish &&
            (idioma === "español" || idioma === "espanol" || idioma === "spanish")) ||
          (languageFilters.english &&
            (idioma === "inglés" || idioma === "ingles" || idioma === "english"))
        );
      });
    }
    
    // Aplicar ordenamiento
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
    
    return result;
  }, [
    selectedCategories,
    priceRange,
    ratingFilters,
    durationFilters,
    languageFilters,
    sortType
  ]);
  
  // Función principal de filtrado
  const filterActivities = useCallback(async () => {
    if (!dataLoaded || isFilteringRef.current) return;
    
    // Solo mostrar "cargando" si el término de búsqueda tiene al menos 2 caracteres
    const trimmedSearchTerm = searchTerm?.trim() || "";
    
    // Si tiene suficiente longitud, mostrar estado de carga
    if (trimmedSearchTerm.length >= 2) {
      setLoading(true);
    }
    
    isFilteringRef.current = true;
    
    try {
      let result = [];
      
      // Si hay término de búsqueda válido, usamos la API a través del servicio compartido
      if (trimmedSearchTerm.length >= 2) {
        lastSearchTermRef.current = trimmedSearchTerm;
        result = await searchByApi(trimmedSearchTerm);
      } 
      // Si no hay búsqueda, usamos todas las actividades
      else {
        lastSearchTermRef.current = "";
        result = [...activities];
      }
      
      // Aplicar el resto de filtros
      const finalResult = applyOtherFilters(result);
      
      // Verificar que el término de búsqueda no haya cambiado durante el procesamiento
      if (lastSearchTermRef.current === trimmedSearchTerm) {
        setFilteredActivities(finalResult);
        setTotalPages(Math.max(1, Math.ceil(finalResult.length / itemsPerPage)));
      }
    } catch (error) {
      console.error("Error filtering activities:", error);
      if (lastSearchTermRef.current === trimmedSearchTerm) {
        setFilteredActivities([]);
        setTotalPages(1);
      }
    } finally {
      if (lastSearchTermRef.current === trimmedSearchTerm) {
        setLoading(false);
      }
      isFilteringRef.current = false;
    }
  }, [
    activities,
    searchTerm,
    dataLoaded,
    itemsPerPage,
    searchByApi,
    applyOtherFilters
  ]);
  
  // Efecto principal para filtrar con debounce
  useEffect(() => {
    if (!dataLoaded) return;
    
    // Obtener el término limpio una sola vez
    const trimmedSearchTerm = searchTerm?.trim() || "";
    
    // Limpiar timeout anterior
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    // Si el término es demasiado corto, no hay necesidad de mostrar "cargando"
    if (trimmedSearchTerm.length < 2) {
      // Si no hay búsqueda, aplicar filtros normales inmediatamente
      if (trimmedSearchTerm.length === 0) {
        filterTimeoutRef.current = setTimeout(() => {
          filterActivities();
        }, 100);
      }
      return;
    }
    
    // Para términos válidos, usar debounce más largo
    filterTimeoutRef.current = setTimeout(() => {
      filterActivities();
    }, 400);
    
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [
    filterActivities,
    dataLoaded,
    searchTerm
  ]);
  
  // Efecto específico para filtros que no son de búsqueda
  useEffect(() => {
    if (!dataLoaded || !activities.length || searchTerm) return;
    
    // Solo actualizamos si no hay término de búsqueda
    if (!filterTimeoutRef.current) {
      filterTimeoutRef.current = setTimeout(() => {
        filterActivities();
      }, 100);
    }
  }, [
    selectedCategories,
    selectedDate,
    priceRange,
    ratingFilters,
    durationFilters,
    languageFilters,
    sortType,
    filterActivities,
    activities,
    dataLoaded,
    searchTerm
  ]);
  
  // Efecto para inicializar actividades al cargar
  useEffect(() => {
    if (activities.length > 0 && filteredActivities.length === 0 && dataLoaded && !searchTerm) {
      setFilteredActivities([...activities]);
      setTotalPages(Math.ceil(activities.length / itemsPerPage));
    }
  }, [activities, filteredActivities.length, itemsPerPage, dataLoaded, searchTerm]);
  
  return {
    filteredActivities,
    totalPages,
    loading,
  };
};
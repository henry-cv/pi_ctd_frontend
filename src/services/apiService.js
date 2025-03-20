// src/services/apiService.js

// Función compartida para buscar productos por término
export const searchProducts = async (query) => {
    // Asegurar que el caché existe y está bien inicializado
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
    
    // Asegurar que las propiedades existen
    window.apiCache.activePromises = window.apiCache.activePromises || {};
    window.apiCache.noResultsTerms = window.apiCache.noResultsTerms || new Set();
    
    // Normalizamos el término de búsqueda
    const trimmedQuery = query.trim();
    
    // Si el término es muy corto, devolvemos resultados básicos
    if (trimmedQuery.length < 2) {
      if (window.apiCache.products) {
        const initialOptions = window.apiCache.products.slice(0, 10);
        return Promise.resolve(initialOptions);
      }
      return Promise.resolve([]);
    }
    
    // Verificar si ya hay una promesa activa para este término
    if (window.apiCache.activePromises[trimmedQuery]) {
      console.log(`[API] Reutilizando promesa existente para: "${trimmedQuery}"`);
      return window.apiCache.activePromises[trimmedQuery];
    }
    
    // INTELIGENTE: Verificar si este término es una extensión de uno sin resultados
    // Ej: Si "aaad" no tiene resultados, entonces "aaads" tampoco tendrá
    for (const term of window.apiCache.noResultsTerms) {
      if (trimmedQuery.startsWith(term)) {
        console.log(`[API] Omitiendo búsqueda para "${trimmedQuery}" porque "${term}" ya no tuvo resultados`);
        return Promise.resolve([]);
      }
    }
    
    // PERO: Si un término previo sin resultados es una extensión del actual, 
    // hay que eliminarlo porque podría ser que el término actual sí tenga resultados
    // Ej: Si "aaas" no tiene resultados, eliminamos esa restricción al buscar "aaa"
    for (const term of window.apiCache.noResultsTerms) {
      if (term.startsWith(trimmedQuery) && term !== trimmedQuery) {
        console.log(`[API] Limpiando restricción: "${term}" es una extensión de "${trimmedQuery}"`);
        window.apiCache.noResultsTerms.delete(term);
      }
    }
    
    // Verificar si hay resultados en caché y son válidos
    if (window.apiCache.suggestions[trimmedQuery] && 
        window.apiCache.suggestions[trimmedQuery].length > 0) {
      console.log(`[API] Usando caché para: "${trimmedQuery}"`);
      return Promise.resolve(window.apiCache.suggestions[trimmedQuery]);
    }
    
    // Control de tasa de llamadas
    const now = Date.now();
    const endpoint = `/api/producto/filtrar?query=${encodeURIComponent(trimmedQuery)}`;
    const lastCall = window.apiCache.lastApiCall[endpoint] || 0;
    
    // Si la última llamada fue muy reciente, esperar un poco
    if (now - lastCall < window.apiCache.minCallInterval) {
      console.log(`[API] Limitando tasa para: "${trimmedQuery}"`);
      return Promise.resolve([]);
    }
    
    // Crear una nueva promesa y guardarla
    console.log(`[API] Nueva llamada a API para: "${trimmedQuery}"`);
    
    // Actualizar timestamp antes de la llamada
    window.apiCache.lastApiCall[endpoint] = now;
    
    const promise = fetch(endpoint)
      .then(response => {
        if (!response.ok) throw new Error("Error al filtrar productos");
        return response.json();
      })
      .then(data => {
        // Formatear los resultados
        const formattedResults = data.map(item => ({
          ...item,
          label: item.nombre,
          id: item.id,
          categorias: item.categorias || []
        }));
        
        // Si no hay resultados, registrar el término
        if (formattedResults.length === 0) {
          window.apiCache.noResultsTerms.add(trimmedQuery);
          
          // Limitar el tamaño del conjunto
          if (window.apiCache.noResultsTerms.size > 50) {
            const iterator = window.apiCache.noResultsTerms.values();
            window.apiCache.noResultsTerms.delete(iterator.next().value);
          }
          
          // Eliminar cualquier entrada en caché
          delete window.apiCache.suggestions[trimmedQuery];
        } else {
          // Si hay resultados, guardar en caché
          window.apiCache.suggestions[trimmedQuery] = formattedResults;
        }
        
        return formattedResults;
      })
      .catch(error => {
        console.error("Error en búsqueda de API:", error);
        return [];
      })
      .finally(() => {
        // Limpiar la promesa activa cuando termine
        setTimeout(() => {
          delete window.apiCache.activePromises[trimmedQuery];
        }, 100);
      });
    
    // Guardar la promesa activa
    window.apiCache.activePromises[trimmedQuery] = promise;
    
    return promise;
};
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
    
    // Verificar si ya hay una promesa activa para este término
    if (window.apiCache.activePromises[query]) {
      console.log(`[API] Reutilizando promesa existente para: "${query}"`);
      return window.apiCache.activePromises[query];
    }
    
    // Verificar si el término comienza con algún prefijo sin resultados
    const globalNoResultsTerms = window.apiCache.noResultsTerms;
    if (globalNoResultsTerms && globalNoResultsTerms.size > 0) {
      for (const noResultTerm of globalNoResultsTerms) {
        if (query.startsWith(noResultTerm)) {
          console.log(`[API] Omitiendo búsqueda para "${query}" porque "${noResultTerm}" ya no tuvo resultados`);
          return Promise.resolve([]);
        }
      }
    }
    
    // Verificar si hay resultados en caché
    if (window.apiCache.suggestions[query]) {
      console.log(`[API] Usando caché para: "${query}"`);
      return Promise.resolve(
        window.apiCache.suggestions[query].map(option => {
          // Si tenemos el producto completo en el caché, lo devolvemos
          if (window.apiCache.products) {
            const product = window.apiCache.products.find(p => p.id === option.id);
            if (product) return product;
          }
          // Si no, devolvemos lo que tenemos
          return { id: option.id, nombre: option.label, categorias: option.categorias };
        })
      );
    }
    
    // Control de tasa de llamadas
    const now = Date.now();
    const endpoint = `/api/producto/filtrar?query=${encodeURIComponent(query)}`;
    const lastCall = window.apiCache.lastApiCall[endpoint] || 0;
    
    if (now - lastCall < window.apiCache.minCallInterval) {
      console.log(`[API] Limitando tasa para: "${query}"`);
      return Promise.resolve([]);
    }
    
    // Crear una nueva promesa y guardarla
    console.log(`[API] Nueva llamada a API para: "${query}"`);
    
    const promise = new Promise(async (resolve, reject) => {
      try {
        // Actualizar timestamp
        window.apiCache.lastApiCall[endpoint] = now;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error al filtrar productos");
        const data = await response.json();
        
        // Guardar en caché de sugerencias para futuras referencias
        window.apiCache.suggestions[query] = data.map(item => ({
          label: item.nombre,
          id: item.id,
          categorias: item.categorias || []
        }));
        
        // Si no hay resultados, agregar al conjunto de términos sin resultados
        if (data.length === 0) {
          window.apiCache.noResultsTerms.add(query);
          
          // Limitar tamaño del conjunto
          if (window.apiCache.noResultsTerms.size > 50) {
            const iterator = window.apiCache.noResultsTerms.values();
            window.apiCache.noResultsTerms.delete(iterator.next().value);
          }
        }
        
        resolve(data);
      } catch (error) {
        console.error("Error en búsqueda de API:", error);
        reject(error);
      } finally {
        // Limpiar la promesa activa cuando termine
        setTimeout(() => {
          delete window.apiCache.activePromises[query];
        }, 100);
      }
    });
    
    // Guardar la promesa activa
    window.apiCache.activePromises[query] = promise;
    
    return promise;
  };
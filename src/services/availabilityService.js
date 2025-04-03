// src/services/availabilityService.js

// Cache de disponibilidad
const availabilityCache = {
    data: {},
    lastFetch: {},
    minFetchInterval: 60000, // 1 minuto
    activePromises: {}
  };
  
  /**
   * Obtener la disponibilidad de un producto
   * @param {number} productId - ID del producto
   * @returns {Promise<Array>} - Array con la disponibilidad
   */
  export const getProductAvailability = async (productId) => {
    // Verificar si ya hay una promesa activa
    if (availabilityCache.activePromises[productId]) {
      return availabilityCache.activePromises[productId];
    }
    
    // Verificar si hay datos en cache y son recientes
    const now = Date.now();
    if (
      availabilityCache.data[productId] &&
      now - (availabilityCache.lastFetch[productId] || 0) < availabilityCache.minFetchInterval
    ) {
      return Promise.resolve(availabilityCache.data[productId]);
    }
    
    // Crear nueva promesa para obtener los datos
    const promise = new Promise(async (resolve, reject) => {
      try {
        console.log(`Obteniendo disponibilidad para producto ${productId}`);
        const response = await fetch(`/api/disponibilidad/${productId}`);
        
        if (!response.ok) {
          console.warn(`Error al obtener disponibilidad para producto ${productId}`);
          resolve([]);
          return;
        }
        
        const data = await response.json();
        
        // Guardar en cache
        availabilityCache.data[productId] = data;
        availabilityCache.lastFetch[productId] = now;
        
        resolve(data);
      } catch (error) {
        console.error(`Error al obtener disponibilidad para producto ${productId}:`, error);
        resolve([]);
      } finally {
        // Limpiar promesa activa
        setTimeout(() => {
          delete availabilityCache.activePromises[productId];
        }, 100);
      }
    });
    
    // Guardar promesa activa
    availabilityCache.activePromises[productId] = promise;
    
    return promise;
  };
  
  // Función para cargar la disponibilidad de todas las actividades de fecha única
  export const loadSingleDateAvailabilities = async (activities) => {
    // Filtrar solo actividades de fecha única
    const singleDateActivities = activities.filter(act => act.tipoEvento === 'FECHA_UNICA');
    
    if (singleDateActivities.length === 0) {
      return [];
    }
    
    console.log(`Cargando disponibilidad para ${singleDateActivities.length} actividades de fecha única`);
    
    const promises = singleDateActivities.map(activity => 
      getProductAvailability(activity.id)
    );
    
    const results = await Promise.all(promises);
    
    // Asociar cada resultado con su actividad correspondiente
    return singleDateActivities.map((activity, index) => ({
      activity,
      availability: results[index] || []
    }));
  };
  
  /**
   * Verificar si una actividad tiene disponibilidad en un rango de fechas
   * @param {Object} activity - Actividad a verificar
   * @param {Array} dateRange - Rango de fechas [startDate, endDate]
   * @param {Array} availabilityData - Datos de disponibilidad (opcional)
   * @returns {Promise<boolean>} - true si está disponible, false si no
   */
  export const checkAvailabilityInRange = async (activity, dateRange, availabilityData = null) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return true; // Si no hay rango, mostrar todas
    }
    
    const startDate = dateRange[0].toDate();
    const endDate = dateRange[1].toDate();
    
    console.log(`Verificando ${activity.nombre} (${activity.tipoEvento}) en rango ${startDate.toISOString().slice(0, 10)} - ${endDate.toISOString().slice(0, 10)}`);
    
    // Para actividades recurrentes
    if (activity.tipoEvento === 'RECURRENTE' && Array.isArray(activity.diasDisponible)) {
      const dayMap = {
        'LUNES': 1, 'MARTES': 2, 'MIERCOLES': 3, 'JUEVES': 4,
        'VIERNES': 5, 'SABADO': 6, 'DOMINGO': 0
      };
      
      const availableDays = activity.diasDisponible.map(day => dayMap[day]);
      
      // Verificar si hay al menos un día del rango que coincida con los días disponibles
      // Asegurarnos de que el bucle se ejecute al menos una vez, incluso si las fechas son iguales
      let currentDate = new Date(startDate);
      const finalDate = new Date(endDate.getTime() + 86400000); // Añadir un día a la fecha final para el caso mismo día
      
      while (currentDate < finalDate) {
        const dayOfWeek = currentDate.getDay(); // 0-6
        if (availableDays.includes(dayOfWeek)) {
          console.log(`Día coincidente encontrado: ${currentDate.toISOString().slice(0, 10)} (${dayOfWeek})`);
          return true;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return false;
    }
    
    // Para actividades de fecha única
    if (activity.tipoEvento === 'FECHA_UNICA') {
      // Usar datos proporcionados o cargarlos
      let availability = availabilityData;
      if (!availability) {
        availability = await getProductAvailability(activity.id);
      }
      
      if (!availability || !Array.isArray(availability) || availability.length === 0) {
        console.log(`Sin datos de disponibilidad para ${activity.id}`);
        return false;
      }
      
      // Verificar si alguna de las fechas disponibles está dentro del rango
      // Añadimos un día al endDate para casos donde startDate y endDate son iguales
      const adjustedEndDate = new Date(endDate);
      if (startDate.getTime() === endDate.getTime()) {
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        console.log(`Fecha inicio y fin iguales, ajustando rango a: ${startDate.toISOString().slice(0, 10)} - ${adjustedEndDate.toISOString().slice(0, 10)}`);
      }
      
      return availability.some(disp => {
        const eventDate = new Date(disp.fechaEvento);
        const hasAvailability = disp.cuposDisponibles > 0;
        const isInRange = eventDate >= startDate && eventDate < adjustedEndDate;
        
        if (isInRange) {
          console.log(`Fecha ${disp.fechaEvento} para actividad ${activity.id} está en rango: ${isInRange}, cupos: ${disp.cuposDisponibles}`);
        }
        
        return isInRange && hasAvailability;
      });
    }
    
    return true; // Por defecto
  };
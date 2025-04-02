import { useState, useEffect } from "react";

// Mapa de días de la semana
export const daysMap = {
  "DOMINGO": 0,
  "LUNES": 1,
  "MARTES": 2,
  "MIERCOLES": 3,
  "JUEVES": 4,
  "VIERNES": 5,
  "SABADO": 6,
};

// Función para normalizar una fecha (eliminar horas, minutos, segundos)
export const normalizeDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Hook para manejar la lógica del calendario
export const funtionsBookingCalendar = ({
  dateRange, 
  setDateRange, 
  availability, 
  setBookingDate, 
  bookingDate, 
  resetCalendar, 
  setResetCalendar, 
  availabilityMap = {},
  state,
  dateRangeRef,
  setTheDateIsPast,
}) => {
  const [selectedDate, setSelectedDate] = useState(bookingDate || dateRange[0]?.startDate);
  const [visibleMonth, setVisibleMonth] = useState(new Date().getMonth());
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const [haHechoClicEnFechaUnica, setHaHechoClicEnFechaUnica] = useState(false);
  const [errors, setErrors] = useState("");
  const [primeraFechaValida, setPrimeraFechaValida] = useState(null);

  const handleMonthChange = (date) => {
    setVisibleMonth(date.getMonth());
    setVisibleYear(date.getFullYear());
  };


  const extractDates = () => {
    if (!state.activity?.theActivity) return { fechas: [] };
    
    const activityData = state.activity.theActivity;
    
    const eventosArray = Object.keys(activityData)
      .filter(key => !isNaN(parseInt(key)))
      .map(key => activityData[key]);
    
    const fechas = eventosArray.map(evento => evento.fechaEvento);
    
    return { fechas };
  };

  const { fechas } = extractDates();


  useEffect(() => {
    // Caso 1: Cuando el tipo es "dias" y hay fechas disponibles
    if (availability?.type === "dias" && fechas.length > 0) {
      const today = normalizeDate(new Date());
      let fechaSeleccionada;
      
      // Buscar la primera fecha válida (no anterior a hoy)
      let fechaValida = null;
      for (let i = 0; i < fechas.length; i++) {
        const fecha = normalizeDate(new Date(fechas[i]));
        if (fecha >= today) {
          fechaValida = fecha;
          break;
        }
      }
      
      if (fechaValida) {
        fechaSeleccionada = fechaValida;
        setPrimeraFechaValida(fechaValida);
      } else {
        setErrors("Esta actividad ya pasó");
        fechaSeleccionada = new Date(fechas[0]);
      }
      

      setVisibleMonth(fechaSeleccionada.getMonth());
      setVisibleYear(fechaSeleccionada.getFullYear());
      

      if (dateRangeRef.current?.setShownDate) {
        try {
          dateRangeRef.current.setShownDate(fechaSeleccionada);
        } catch (error) {
          console.error("Error al establecer fecha mostrada:", error);
        }
      }
    } 
    // Caso 2: Cuando el tipo es "fecha" - seleccionar directamente la fecha especificada
    else if (availability?.type === "fecha" && availability?.fecha) {
      const fechaUnica = new Date(availability.fecha);
      
      setPrimeraFechaValida(fechaUnica);
      
      setVisibleMonth(fechaUnica.getMonth());
      setVisibleYear(fechaUnica.getFullYear());
      
      if (dateRangeRef.current?.setShownDate) {
        try {
          dateRangeRef.current.setShownDate(fechaUnica);
        } catch (error) {
          console.error("Error al establecer fecha mostrada:", error);
        }
      }
    }
  }, [availability]);


  // Efecto para establecer la primera fecha visible
  // useEffect(() => {
  //   if (availability?.type === "dias" && fechas.length > 0) {
  //     const primerFecha = new Date(fechas[0]);
  
  //     // Establecemos el mes y el año visibles solo al cargar el componente
  //     setVisibleMonth(primerFecha.getMonth());
  //     setVisibleYear(primerFecha.getFullYear());
  
  //     // Navegar al mes correcto solo una vez
  //     if (dateRangeRef.current && dateRangeRef.current.setShownDate) {
  //       try {
  //         dateRangeRef.current.setShownDate(primerFecha);
  //       } catch (error) {
  //         console.error("Error al establecer fecha mostrada:", error);
  //       }
  //     }
  //   }
  // }, []); 

  // Efecto para restaurar el estado del calendario
  useEffect(() => {
    if (resetCalendar) {
      resetCalendarState();  
      setResetCalendar(false);   
    }
  }, [resetCalendar]);

  // Efecto para actualizar el calendario cuando cambia la fecha de reserva
  useEffect(() => {
    if (bookingDate) {
      setSelectedDate(bookingDate);
      setVisibleMonth(bookingDate.getMonth());
      setVisibleYear(bookingDate.getFullYear());
  
      setTimeout(() => {
        if (dateRangeRef.current && dateRangeRef.current.setShownDate) {
          try {
            dateRangeRef.current.setShownDate(bookingDate);
          } catch (error) {
            console.error("Error al establecer la fecha mostrada:", error);
          }
        }
      }, 50);
    }
  }, [bookingDate]);
  
  // Función para obtener la clase CSS para cada día
  const getDayClass = (day) => {
    const isOutsideMonth = day.getMonth() !== visibleMonth || day.getFullYear() !== visibleYear;
    if (isOutsideMonth) return "";
  
    const today = normalizeDate(new Date());
    const normalizedDay = normalizeDate(day);
    const dayOfWeek = day.getDay();
    const dayName = Object.keys(daysMap).find((key) => daysMap[key] === dayOfWeek);
    const isPast = normalizedDay < today;
    const isToday = normalizedDay.toDateString() === today.toDateString();
    
    // Check availability for this specific date
    const dateString = normalizedDay.toISOString().split('T')[0];
    const cuposDisponibles = availabilityMap[dateString] || 0;
    
    let isAvailable = false;
    
    if (availability?.type === "dias") {
      isAvailable = availability.data.includes(dayName);
      
      if (isAvailable && fechas.length > 0) {
        const primerFecha = new Date(fechas[0]);
        const ultimaFecha = new Date(fechas[fechas.length - 1]+"T00:00:00");
        const normalizedPrimerFecha = normalizeDate(primerFecha);
        const normalizedUltimaFecha = normalizeDate(ultimaFecha);
        
        isAvailable = normalizedDay >= normalizedPrimerFecha && normalizedDay <= normalizedUltimaFecha;
      }
    } else if (availability?.type === "fecha") {
      isAvailable = availability.data.some((dateStr) => {
        const normalizedAvailableDate = normalizeDate(new Date(dateStr +"T00:00:00"));
        return normalizedAvailableDate.toDateString() === normalizedDay.toDateString();
      });
    }

    const isSingleDate =
      availability?.type === "fecha" &&
      availability.data.length === 1 &&
      isAvailable;
  
    // Fechas anteriores
    if (isPast) return "disabled-day-no-pointer";
    
    // Día actual no disponible
    if (isToday) {
      // Si el día actual está disponible, le damos la clase de disponible
      if (isAvailable) {
        if (cuposDisponibles <= 0) {
          return "disabled-day";
        }
        // Si es fecha única y está disponible
        if (isSingleDate) {
          return  "selected-day";
        }
        // Si está disponible como día regular
        return "available-day";
      }
      // Si no está disponible, continuamos mostrándolo como transparente
      return "transparent-day";
    }

    
    // Para fecha única 
    if (isSingleDate) {
      if (cuposDisponibles <= 0) {
        return "disabled-day";
      }
      return "selected-day";
    }
  
    // Día seleccionado
    if (bookingDate && normalizedDay.toDateString() === normalizeDate(bookingDate).toDateString()) {
      return "selected-day";
    }
  
    // Días disponibles para fecha recurrente
    if (isAvailable) {
      if (cuposDisponibles <= 0) {
        return "disabled-day";
      }
      return "available-day";
    }
  
    return "semi-available-day";
  };

  // Función para reiniciar el estado del calendario
  const resetCalendarState = () => {
    setHaHechoClicEnFechaUnica(false);
    setSelectedDate(null);

    if (availability?.type === "fecha" && availability.data.length > 0) {
      const otra = normalizeDate(new Date(availability.data[0] + "T00:00:00"));
      const today = normalizeDate(new Date());
      
      if (otra >= today) {
        setVisibleMonth(otra.getMonth());
        setVisibleYear(otra.getFullYear());
        
        if (availability.data.length === 1) {
          setSelectedDate(otra);
          setDateRange([{ 
            startDate: otra, 
            endDate: otra, 
            key: "selection" 
          }]);

          setHaHechoClicEnFechaUnica(true);
          setBookingDate(otra);
        }
      }
    } else if (availability?.type === "dias" && fechas.length > 0) {
      const primerFecha = new Date(fechas[0]);
      setVisibleMonth(primerFecha.getMonth());
      setVisibleYear(primerFecha.getFullYear());
      
      setTimeout(() => {
        if (dateRangeRef.current && dateRangeRef.current.setShownDate) {
          try {
            dateRangeRef.current.setShownDate(primerFecha);
          } catch (error) {
            console.error("Error al establecer fecha mostrada:", error);
          }
        }
      }, 50);
      
      setDateRange([{ 
        startDate: new Date(), 
        endDate: new Date(), 
        key: "selection" 
      }]);
    } else {
      const currentDate = new Date();
      setVisibleMonth(currentDate.getMonth());
      setVisibleYear(currentDate.getFullYear());
      
      setDateRange([{ 
        startDate: new Date(), 
        endDate: new Date(), 
        key: "selection" 
      }]);
    }
  };

  // Función para manejar la selección de fecha
  const handleDateSelection = (selected) => {
    const dateString = selected.toISOString().split('T')[0];
    const cuposDisponibles = availabilityMap[dateString] || 0;
    
    // Don't allow selection of dates with no available spots
    if (cuposDisponibles <= 0) {
      return;
    }
    
    setHaHechoClicEnFechaUnica(true);
    setSelectedDate(selected);
    setDateRange([{ startDate: selected, endDate: selected, key: "selection" }]);
    setBookingDate(selected);
  };

  return {
    selectedDate,
    visibleMonth,
    visibleYear,
    haHechoClicEnFechaUnica,
    errors,
    handleMonthChange,
    getDayClass,
    resetCalendarState,
    handleDateSelection,
    fechas,
    primeraFechaValida
  };
};
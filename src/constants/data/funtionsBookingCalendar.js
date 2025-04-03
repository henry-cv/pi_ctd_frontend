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
  if (!date) return null;
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
  isBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState(bookingDate || (dateRange[0]?.startDate || null));
  const [visibleMonth, setVisibleMonth] = useState(new Date().getMonth());
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const [haHechoClicEnFechaUnica, setHaHechoClicEnFechaUnica] = useState(false);
  const [errors, setErrors] = useState("");
  const [primeraFechaValida, setPrimeraFechaValida] = useState(null);
  const [initialSetupDone, setInitialSetupDone] = useState(false);

  const handleMonthChange = (date) => {
    if (date && !isNaN(date.getTime())) {
      setVisibleMonth(date.getMonth());
      setVisibleYear(date.getFullYear());
    }
  };

  const extractDates = () => {
    if (!state.activity?.theActivity) return { fechas: [] };
    
    const activityData = state.activity.theActivity;
    
    const eventosArray = Object.keys(activityData)
      .filter(key => !isNaN(parseInt(key)))
      .map(key => activityData[key]);
    
    const fechas = eventosArray
      .filter(evento => evento && evento.fechaEvento)
      .map(evento => evento.fechaEvento);
    
    return { fechas };
  };

  const { fechas } = extractDates();

  // Initial setup effect - runs only once
  useEffect(() => {
    if (initialSetupDone) return;
    
    let fechaSeleccionada = null;

    // Set selected date based on existing booking
    if (isBooking && state.activity?.theActivity?.disponibilidadProductoSalidaDto?.fechaEvento) {
      try {
        const fechaStr = state.activity.theActivity.disponibilidadProductoSalidaDto.fechaEvento;
        const fechaReserva = new Date(`${fechaStr}T00:00:00`);
        
        if (!isNaN(fechaReserva.getTime())) {
          fechaSeleccionada = fechaReserva;
          // Don't call setBookingDate here to avoid the loop
          setSelectedDate(fechaReserva);
        }
      } catch (error) {
        console.error("Error parsing booking date:", error);
      }
    }
    
    // Set dates for recurring events
    if (!fechaSeleccionada && !isBooking && availability?.type === "dias" && fechas.length > 0) {
      const today = normalizeDate(new Date());
      
      for (let i = 0; i < fechas.length; i++) {
        try {
          const fechaStr = fechas[i];
          const fecha = normalizeDate(new Date(`${fechaStr}T00:00:00`));
          
          if (!isNaN(fecha.getTime()) && fecha >= today) {
            fechaSeleccionada = fecha;
            break;
          }
        } catch (error) {
          console.error("Error parsing date:", error, fechas[i]);
        }
      }
      
      if (!fechaSeleccionada && fechas.length > 0) {
        try {
          const fechaStr = fechas[0];
          const fecha = normalizeDate(new Date(`${fechaStr}T00:00:00`));
          
          if (!isNaN(fecha.getTime())) {
            setErrors("Esta actividad ya pasó");
            fechaSeleccionada = fecha;
          }
        } catch (error) {
          console.error("Error parsing first date:", error);
        }
      }
    }
    
    // Set exact date for single events
    if (!fechaSeleccionada && !isBooking && availability?.type === "fecha" && availability?.data) {
      try {
        const fechaStr = Array.isArray(availability.data) ? availability.data[0] : availability.data;
        const fecha = new Date(`${fechaStr}T00:00:00`);
        
        if (!isNaN(fecha.getTime())) {
          fechaSeleccionada = fecha;
          // Safely call setBookingDate only on initial setup
          if (!bookingDate) {
            setBookingDate(fecha);
          }
        }
      } catch (error) {
        console.error("Error parsing single event date:", error);
      }
    }

    if (fechaSeleccionada && !isNaN(fechaSeleccionada.getTime())) {
      setPrimeraFechaValida(fechaSeleccionada);
      setVisibleMonth(fechaSeleccionada.getMonth());
      setVisibleYear(fechaSeleccionada.getFullYear());
      
      // Use setTimeout to ensure references are available
      setTimeout(() => {
        if (dateRangeRef.current?.setShownDate) {
          try {
            dateRangeRef.current.setShownDate(fechaSeleccionada);
          } catch (error) {
            console.error("Error setting shown date:", error);
          }
        }
      }, 100);
    }
    
    setInitialSetupDone(true);
  }, [availability, isBooking, state.activity, fechas.length, bookingDate, setBookingDate]);

  // Effect for resetting calendar state
  useEffect(() => {
    if (resetCalendar) {
      resetCalendarState();  
      setResetCalendar(false);   
    }
  }, [resetCalendar]);

  // Effect for updating calendar when booking date changes
  // Use proper dependency array to prevent infinite updates
  useEffect(() => {
    if (!bookingDate || !initialSetupDone) return;
    
    setSelectedDate(bookingDate);
    
    if (!isNaN(bookingDate.getMonth()) && !isNaN(bookingDate.getFullYear())) {
      setVisibleMonth(bookingDate.getMonth());
      setVisibleYear(bookingDate.getFullYear());
    
      setTimeout(() => {
        if (dateRangeRef.current?.setShownDate) {
          try {
            dateRangeRef.current.setShownDate(bookingDate);
          } catch (error) {
            console.error("Error setting shown date:", error);
          }
        }
      }, 50);
    }
  }, [bookingDate, initialSetupDone]);
  
  // Function to get CSS class for each day
  const getDayClass = (day) => {
    if (!day || isNaN(day.getTime())) return "";
    
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
    
    // Verify if this day corresponds to event date when isBooking is true
    let isBookingEventDate = false;
    if (isBooking && state.activity?.theActivity?.disponibilidadProductoSalidaDto?.fechaEvento) {
      try {
        const bookingDateStr = state.activity.theActivity.disponibilidadProductoSalidaDto.fechaEvento;
        const bookingDate = normalizeDate(new Date(`${bookingDateStr}T00:00:00`));
        isBookingEventDate = bookingDate && normalizedDay.toDateString() === bookingDate.toDateString();
      } catch (error) {
        console.error("Error comparing booking date:", error);
      }
    }
    
    if (availability?.type === "dias" && Array.isArray(availability.data)) {
      isAvailable = availability.data.includes(dayName);
      
      if (isAvailable && fechas.length > 0) {
        try {
          const primerFecha = normalizeDate(new Date(`${fechas[0]}T00:00:00`));
          const ultimaFecha = normalizeDate(new Date(`${fechas[fechas.length - 1]}T00:00:00`));
          
          if (primerFecha && ultimaFecha && !isNaN(primerFecha.getTime()) && !isNaN(ultimaFecha.getTime())) {
            isAvailable = normalizedDay >= primerFecha && normalizedDay <= ultimaFecha;
          }
        } catch (error) {
          console.error("Error comparing date ranges:", error);
        }
      }
    } else if (availability?.type === "fecha" && Array.isArray(availability.data)) {
      isAvailable = availability.data.some((dateStr) => {
        try {
          const availableDate = normalizeDate(new Date(`${dateStr}T00:00:00`));
          return availableDate && normalizedDay.toDateString() === availableDate.toDateString();
        } catch (error) {
          console.error("Error comparing available dates:", error, dateStr);
          return false;
        }
      });
    }
  
    const isSingleDate = availability?.type === "fecha" && 
                         Array.isArray(availability.data) && 
                         availability.data.length === 1 && 
                         isAvailable;
  
    // Past dates
    if (isPast) return "disabled-day-no-pointer";
    
    // Current day
    if (isToday) {
      if (isAvailable) {
        if (cuposDisponibles <= 0) {
          return "disabled-day";
        }
        // Single date or booking date
        if (isSingleDate || isBookingEventDate) {
          return "selected-day";
        }
        return "available-day";
      }
      return "transparent-day";
    }
  
    // Single date or exact booking date
    if (isSingleDate || isBookingEventDate) {
      if (cuposDisponibles <= 0 && !isBookingEventDate) {
        return "disabled-day";
      }
      return "selected-day";
    }
  
    // Selected day
    if (bookingDate && normalizedDay.toDateString() === normalizeDate(bookingDate).toDateString()) {
      return "selected-day";
    }
  
    // Available day
    if (isAvailable) {
      if (cuposDisponibles <= 0) {
        return "disabled-day";
      }
      return "available-day";
    }
  
    // Unavailable day
    return "disabled-day-no-pointer";
  };

  // Function to reset calendar state
  const resetCalendarState = () => {
    setHaHechoClicEnFechaUnica(false);
    setSelectedDate(null);

    if (availability?.type === "fecha" && Array.isArray(availability.data) && availability.data.length > 0) {
      try {
        const dateStr = availability.data[0];
        const otra = normalizeDate(new Date(`${dateStr}T00:00:00`));
        const today = normalizeDate(new Date());
        
        if (otra && !isNaN(otra.getTime()) && otra >= today) {
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
      } catch (error) {
        console.error("Error resetting single date calendar:", error);
      }
    } else if (availability?.type === "dias" && fechas.length > 0) {
      try {
        const dateStr = fechas[0];
        const primerFecha = new Date(`${dateStr}T00:00:00`);
        
        if (!isNaN(primerFecha.getTime())) {
          setVisibleMonth(primerFecha.getMonth());
          setVisibleYear(primerFecha.getFullYear());
          
          setTimeout(() => {
            if (dateRangeRef.current && dateRangeRef.current.setShownDate) {
              try {
                dateRangeRef.current.setShownDate(primerFecha);
              } catch (error) {
                console.error("Error setting shown date:", error);
              }
            }
          }, 50);
        }
      } catch (error) {
        console.error("Error resetting recurring calendar:", error);
      }
      
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

  // Function to handle date selection
  const handleDateSelection = (selected) => {
    if (!selected || isNaN(selected.getTime())) return;
    
    const dateString = selected.toISOString().split('T')[0];
    const cuposDisponibles = availabilityMap[dateString] || 0;
    
    // Don't allow selection of dates with no available spots
    if (cuposDisponibles <= 0) {
      return;
    }
    
    setHaHechoClicEnFechaUnica(true);
    setSelectedDate(selected);
    setDateRange([{ startDate: selected, endDate: selected, key: "selection" }]);
    
    // Only call setBookingDate if the date has changed to prevent infinite loops
    if (!bookingDate || bookingDate.toDateString() !== selected.toDateString()) {
      setBookingDate(selected);
    }
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
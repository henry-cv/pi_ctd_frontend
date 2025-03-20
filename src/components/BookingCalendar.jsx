import { Popover, Box, Typography, useMediaQuery } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useState, useRef , useCallback} from "react";
import "../css/components/BookingCalendar.css";
import { useContextGlobal } from "../gContext/globalContext";
import { es } from "date-fns/locale";

const BookingCalendar = ({
  anchorEl,
  handleClose,
  dateRange,
  setDateRange,
  availability,
  setBookingDate,
  bookingDate,
  resetCalendar,
  setResetCalendar,
  cupoDisponible
}) => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [selectedDate, setSelectedDate] = useState(bookingDate || dateRange[0]?.startDate);
  const [visibleMonth, setVisibleMonth] = useState(new Date().getMonth());
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const [haHechoClicEnFechaUnica, setHaHechoClicEnFechaUnica] = useState(false);
  const [errors, setErrors] = useState("");
  const { state } = useContextGlobal();
  const dateRangeRef = useRef(null);

  // console.log("labooking date",bookingDate);
  
  const daysMap = {
    "DOMINGO": 0,
    "LUNES": 1,
    "MARTES": 2,
    "MIERCOLES": 3,
    "JUEVES": 4,
    "VIERNES": 5,
    "SABADO": 6,
  };

  console.log("cupo dispo",cupoDisponible);
  

  const normalizeDate = (date) => {
    
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };


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

    console.log("Fechas ordenadas:", fechas);
    
    
    return { fechas };
  };

  const { fechas} = extractDates();

  
  useEffect(() => {
    if (availability?.type === "dias" && fechas.length > 0 && dateRangeRef.current) {
      try {
        const primerFecha = new Date(fechas[0]);
        console.log("entré  tipo fecha la primera fecha del array",primerFecha);
        

        if (dateRangeRef.current.setShownDate) {
          dateRangeRef.current.setShownDate(primerFecha);
        }
      } catch (error) {
        console.error("Error al establecer fecha mostrada:", error);
      }
    }
  }, [fechas, availability, anchorEl]);

  useEffect(() => {
    setErrors("");
    const today = normalizeDate(new Date());
    console.log("entro a ussefect de fecha unica");
    
  
    if (availability?.type === "fecha" && availability.data.length > 0) {
      const otra = normalizeDate(new Date(availability.data[0] + "T00:00:00"));

      console.log("fecha unica esta " , otra);
  
      if (otra < today) {
        setErrors("Esta actividad ya pasó");
        return;
      }
  
      setVisibleMonth(otra.getMonth());
      setVisibleYear(otra.getFullYear());
  
      if (availability.data.length === 1 && !bookingDate) {
        setSelectedDate(otra);
        setDateRange([{ startDate: otra, endDate: otra, key: "selection" }]);
        setHaHechoClicEnFechaUnica(true);
        setBookingDate(otra);
      }
    }
    
  }, [availability]);
  
  // const generarDiasDisponibles = useCallback((start, end, diasPermitidos) => {
  //   let fechasDisponibles = [];
  //   let currentDate = new Date(start);
  
  //   while (currentDate <= end) {
  //     if (diasPermitidos.includes(currentDate.getDay())) {
  //       fechasDisponibles.push(new Date(currentDate));
  //     }
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }
  
  //   return fechasDisponibles;
  // }, []);
  
  useEffect(() => {
    if (availability?.type === "dias" && fechas.length > 0) {
      const primerFecha = new Date(fechas[0]);
  
      // Establecemos el mes y el año visibles solo al cargar el componente
      setVisibleMonth(primerFecha.getMonth());
      setVisibleYear(primerFecha.getFullYear());
  
      // Navegar al mes correcto solo una vez
      if (dateRangeRef.current && dateRangeRef.current.setShownDate) {
        try {
          dateRangeRef.current.setShownDate(primerFecha);
        } catch (error) {
          console.error("Error al establecer fecha mostrada:", error);
        }
      }
    }
  }, []); 
  
  

  const getDayClass = (day) => {
    console.log(day,"day");
    
    const isOutsideMonth = day.getMonth() !== visibleMonth || day.getFullYear() !== visibleYear;
    if (isOutsideMonth) return "";
  
    const today = normalizeDate(new Date());
    const normalizedDay = normalizeDate(day);
    const dayOfWeek = day.getDay();
    const dayName = Object.keys(daysMap).find((key) => daysMap[key] === dayOfWeek);
    const isPast = normalizedDay < today;
    const isToday = normalizedDay.toDateString() === today.toDateString();
    
    let isAvailable = false;
    
    if (availability?.type === "dias") {
      isAvailable = availability.data.includes(dayName);

      // console.log("las fechas",fechas[fechas.length-1]);
      // console.log("Tipo de dato:", typeof fechas[fechas.length - 1]);
      
      
      if (isAvailable && fechas.length > 0) {
        const primerFecha = new Date(fechas[0]);
        const ultimaFecha = new Date(fechas[fechas.length - 1]+"T00:00:00");
        const normalizedPrimerFecha = normalizeDate(primerFecha);
        const normalizedUltimaFecha = normalizeDate(ultimaFecha);

        console.log(normalizeDate(ultimaFecha));
        
        
        isAvailable = normalizedDay >= normalizedPrimerFecha && normalizedDay <= normalizedUltimaFecha;
      }
    } else if (availability?.type === "fecha") {
      isAvailable = availability.data.some((dateStr) => {
        const normalizedAvailableDate = normalizeDate(new Date(dateStr + "T00:00:00"));
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
    if (isToday ) {
      return  "transparent-day";
    }
  
    // Para fecha única 
    if (isSingleDate) {
      if (!cupoDisponible) {
        console.log("no hay cupos")
        return "disabled-day";
      }
      console.log("hay cupos")
      return !haHechoClicEnFechaUnica ? "selected-day overlay-class" : "selected-day";
    }
  
    // Día seleccionado
    if (bookingDate && normalizedDay.toDateString() === normalizeDate(bookingDate).toDateString()) {
      return "selected-day";
    }
  
    // Días disponibles para fecha recurrente
    if (isAvailable){
      if (!cupoDisponible) {
        return "disabled-day";
      }
    
       return "available-day";}
  
    return "semi-available-day";
  };

  useEffect(() => {
    if (resetCalendar) {
      resetCalendarState();  
      setResetCalendar(false);   
    }
  }, [resetCalendar]);

  useEffect(() => {
    if (anchorEl && bookingDate) {
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
  }, [anchorEl, bookingDate]);
  

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

  const handleDateSelection = (selected) => {

    setHaHechoClicEnFechaUnica(true);
    setSelectedDate(selected);
    setDateRange([{ startDate: selected, endDate: selected, key: "selection" }]);
    setBookingDate(selected);
  };

  return (
    <Popover
      sx={{ "& .MuiPaper-rounded": { borderRadius: "20px" } }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => {
        handleClose();
      }}
      disableEnforceFocus
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box p={2} className={state.theme === "dark" ? "CardBooking-container" : ""}>
      <DateRange
  ref={dateRangeRef}
  className={`${state.theme === "dark" ? "CardBooking-calendar" : ""} ${isMobile ? "mobile-calendar" : ""}`}
  locale={es}
  ranges={dateRange}
  onChange={(ranges) => {
    const selected = ranges.selection.startDate;

    handleDateSelection(selected);
    handleClose();
  }}
  onShownDateChange={(date) => handleMonthChange(date)}
  
  shownDate={bookingDate ? new Date(bookingDate) : (availability?.type === "dias" && fechas.length > 0 ? new Date(fechas[0]) : new Date())}
  months={1}
  direction={isMobile ? "vertical" : "horizontal"}
  showDateDisplay={false}
  dayContentRenderer={(date) => (
    <div className={getDayClass(date)}>{date.getDate()}</div>
  )}
/>

        <Typography className={isMobile ? "mobile-calendar-legend" : "calendar-legend"}>
          {errors && <p style={{ color: "red" }}>{errors}</p>}
          <p className="legend-text">Estado de los días </p>
          <ul class="legend">
            <li class="legend-item">
              <span className="legend-color disabled"></span>
              Disponible</li>
            <li class="legend-item">
            <span className="legend-color full"></span>
              Cupo lleno
              </li>
            <li class="legend-item">
            <span className="legend-color selected"></span>

            Seleccionado
            </li>
          </ul>
        </Typography>
      </Box>
    </Popover>
  );
};

export default BookingCalendar;
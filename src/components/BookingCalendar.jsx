import { Popover, Box, Typography, useMediaQuery } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useState } from "react";
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
}) => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [selectedDate, setSelectedDate] = useState(dateRange[0]?.startDate);
  const [visibleMonth, setVisibleMonth] = useState(new Date().getMonth());
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const [haHechoClicEnFechaUnica, setHaHechoClicEnFechaUnica] = useState(false);
  const [errors, setErrors] = useState("");
  const { state } = useContextGlobal();
  console.log("la date");
  console.log("la date"+bookingDate);

  const daysMap = {
    "DOMINGO": 0,
    "LUNES": 1,
    "MARTES": 2,
    "MIERCOLES": 3,
    "JUEVES": 4,
    "VIERNES": 5,
    "SABADO": 6,
  };

  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleMonthChange = (date) => {
    setVisibleMonth(date.getMonth());
    setVisibleYear(date.getFullYear());
  };

  useEffect(() => {
    setErrors("");

    const today = normalizeDate(new Date());

    if (availability?.type === "fecha" && availability.data.length > 0) {
      const firstAvailableDate = normalizeDate(new Date(availability.data[0]));

      if (firstAvailableDate < today) {
        setErrors("Esta actividad ya pasó");
        return;
      }

      setVisibleMonth(firstAvailableDate.getMonth());
      setVisibleYear(firstAvailableDate.getFullYear());

      if (availability.data.length === 1) {
        setSelectedDate(firstAvailableDate);
        setDateRange([{ startDate: firstAvailableDate, endDate: firstAvailableDate, key: "selection" }]);
      }
    }
  }, [bookingDate, availability]);

  useEffect(() => {
    if (anchorEl) {
      resetCalendarState();
    }
  }, [anchorEl]);

  const getDayClass = (day) => {
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
    } else if (availability?.type === "fecha") {
      isAvailable = availability.data.some(
        (dateStr) => normalizeDate(new Date(dateStr)).toDateString() === normalizedDay.toDateString()
      );
    }
  

    const isSingleDate =
      availability?.type === "fecha" &&
      availability.data.length === 1 &&
      isAvailable;
  
    // fechas anteriores
    if (isPast) return "disabled-day-no-pointer";
  
    
    if (isToday && !isAvailable) {
      return bookingDate ? "selected-day-no-pointer transparent-day" : "selected-day-no-pointer";
    }
  
        // para fecha unica
    if (isSingleDate) {
      if (!haHechoClicEnFechaUnica) {
        return `selected-day overlay-class`;
      } else {
        return `selected-day`;
      }
    }
  

    if (selectedDate?.toDateString() === normalizedDay.toDateString()) {
      return "selected-day";
    }
  
      //para fecha recurrente
    if (isAvailable) return "available-day";
  

    return "semi-available-day";
  };

  const resetCalendarState = () => {

    const currentDate = new Date();
    setVisibleMonth(currentDate.getMonth());
    setVisibleYear(currentDate.getFullYear());
    

    setHaHechoClicEnFechaUnica(false);
    

    if (availability?.type === "fecha" && availability.data.length > 0) {
      const firstAvailableDate = normalizeDate(new Date(availability.data[0]));
      

      const today = normalizeDate(new Date());
      if (firstAvailableDate >= today) {
        setVisibleMonth(firstAvailableDate.getMonth());
        setVisibleYear(firstAvailableDate.getFullYear());
        
        if (availability.data.length === 1) {
          setSelectedDate(firstAvailableDate);
          setDateRange([{ 
            startDate: firstAvailableDate, 
            endDate: firstAvailableDate, 
            key: "selection" 
          }]);
        }
      }
    } else {
    
      setSelectedDate(null);
      setDateRange([{ 
        startDate: new Date(), 
        endDate: new Date(), 
        key: "selection" 
      }]);
    }
  };
  

  return (
    <Popover
    sx={{ "& .MuiPaper-rounded": { borderRadius: "20px" } }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => {
        setSelectedDate(dateRange[0]?.startDate);
        resetCalendarState();
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
          className={`${state.theme === "dark" ? "CardBooking-calendar" : ""} ${isMobile ? "mobile-calendar" : ""}`}
          locale={es}
          ranges={dateRange}
          onChange={(ranges) => {
            const selected = ranges.selection.startDate;
            if (availability?.type === "fecha" && availability.data.length === 1) {
              setHaHechoClicEnFechaUnica(true);
            }

            setSelectedDate(selected);
            setDateRange([ranges.selection]);
            setBookingDate(selected);

            handleClose();
          }}
          onShownDateChange={(date) => handleMonthChange(date)}
          months={1}
          direction={isMobile ? "vertical" : "horizontal"}
          showDateDisplay={false}
          dayContentRenderer={(date) => (
            <div className={getDayClass(date)}>{date.getDate()}</div>
          )}
        />

        <Typography className={isMobile ? "mobile-calendar-legend" : "calendar-legend"}>
          {errors && <p style={{ color: "red" }}>{errors}</p>}
          <ul>
            <li>Disponible</li>
            <li>Cupo lleno</li>
            <li>Dia Seleccionado</li>
          </ul>
        </Typography>
      </Box>
    </Popover>
  );
};

export default BookingCalendar;
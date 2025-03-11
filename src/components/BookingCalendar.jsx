import { Popover, Box, Typography, useMediaQuery } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState } from "react";
import "../css/components/BookingCalendar.css"
import { useContextGlobal } from "../gContext/globalContext";
import { es } from 'date-fns/locale';

const BookingCalendar = ({ anchorEl, handleClose, dateRange, setDateRange }) => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [selectedDate, setSelectedDate] = useState(dateRange[0]?.startDate);
  const [visibleMonth, setVisibleMonth] = useState(new Date().getMonth());
  const [visibleYear, setVisibleYear] = useState(new Date().getFullYear());
  const { state } = useContextGlobal();


  const handleMonthChange = (date) => {
    setVisibleMonth(date.getMonth());
    setVisibleYear(date.getFullYear());
  };
  
  const getDayClass = (day) => {
    const isOutsideMonth = day.getMonth() !== visibleMonth || day.getFullYear() !== visibleYear;
  
    if (isOutsideMonth) return ""; // No aplicamos ninguna clase si no es del mes visible
    const dayOfWeek = day.getDay();
  
    if (selectedDate?.toDateString() === day.toDateString()) return "selected-day"; // Día seleccionado
    if (dayOfWeek === 0) return "disabled-day"; // Domingo como día no seleccionable
    if (dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5) return "available-day"; // Miércoles a Viernes
    return "semi-available-day"; // Otros días
  };
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      disableEnforceFocus
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box p={2} className={state.theme === "dark" ? "CardBooking-container" : ""}>
        <DateRange className={`${state.theme === "dark" ? "CardBooking-calendar" : ""} ${isMobile ? "mobile-calendar " : ""}`}
              locale={es} 
          ranges={dateRange}
          onChange={(ranges) => {
            setDateRange([ranges.selection]);
            setSelectedDate(ranges.selection.startDate);
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

    
        <Typography  className={isMobile ? "mobile-calendar-legend" : ""}>
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

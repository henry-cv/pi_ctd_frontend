import { Popover, Box, Typography, useMediaQuery } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState } from "react";
import "../css/components/BookingCalendar.css"
import { useContextGlobal } from "../gContext/globalContext";

const BookingCalendar = ({ anchorEl, handleClose, dateRange, setDateRange }) => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [selectedDate, setSelectedDate] = useState(dateRange[0]?.startDate);
  const { state } = useContextGlobal();


  const getDayClass = (day) => {
    const dayOfWeek = day.getDay();

    if (selectedDate?.toDateString() === day.toDateString()) return "selected-day"; // el dia que queda seleccionado
    if (dayOfWeek === 0) return "disabled-day"; // osea el domingo
    if (dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 5) return "available-day"; // Miércoles a Viernes 
    return "semi-available-day"; // Otros días aun no sé si lo voy a usar talvez para el tachado
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box p={2} className={state.theme === "dark" ? "CardBooking-container" : ""}>
        <DateRange className={state.theme === "dark" ? "CardBooking-container" : ""}
          ranges={dateRange}
          onChange={(ranges) => {
            setDateRange([ranges.selection]);
            setSelectedDate(ranges.selection.startDate);
            handleClose();
          }}
          months={isMobile ? 1 : 2}
          direction={isMobile ? "vertical" : "horizontal"}
          showDateDisplay={false}
          dayContentRenderer={(date) => (
            <div className={getDayClass(date)}>{date.getDate()}</div>
          )}
        />

    
        <Typography >
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

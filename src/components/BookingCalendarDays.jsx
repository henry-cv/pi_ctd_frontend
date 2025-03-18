import { Popover, Box, Typography, useMediaQuery } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useState, useRef } from "react";
import "../css/components/BookingCalendar.css";
import { useContextGlobal } from "../gContext/globalContext";
import { es } from "date-fns/locale";

const BookingCalendarDays = ({
  anchorEl,
  handleClose,
  dateRange,
  setDateRange,
  availability,
  setBookingDate,
  bookingDate,
  setCupo,
}) => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [selectedDate, setSelectedDate] = useState(bookingDate || dateRange[0]?.startDate);
  const { state } = useContextGlobal();
  const dateRangeRef = useRef(null);

  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  useEffect(() => {
    if (availability?.type === "dias" && availability.data.length > 0) {
      const primerFecha = new Date(availability.data[0]);
      setSelectedDate(primerFecha);
      setDateRange([{ startDate: primerFecha, endDate: primerFecha, key: "selection" }]);
    }
  }, [availability, anchorEl]);

  const getDayClass = (day) => {
    const today = normalizeDate(new Date());
    const normalizedDay = normalizeDate(day);
    const isPast = normalizedDay < today;
    let isAvailable = false;

    // Verificar si la fecha está disponible
    isAvailable = availability.data.some(
      (dateStr) => normalizeDate(new Date(dateStr)).toDateString() === normalizedDay.toDateString()
    );

    if (isPast) return "disabled-day-no-pointer";
    if (isAvailable) {
      if (selectedDate && normalizedDay.toDateString() === normalizeDate(selectedDate).toDateString()) {
        return "selected-day";
      }
      return "available-day";
    }
    return "semi-available-day";
  };

  const handleDateSelection = (selected) => {
    setSelectedDate(selected);
    setDateRange([{ startDate: selected, endDate: selected, key: "selection" }]);
    setBookingDate(selected);
    const cupoInfo = availability.data.find(
      (dateStr) => normalizeDate(new Date(dateStr)).toDateString() === normalizeDate(selected).toDateString()
    );
    setCupo(cupoInfo ? cupoInfo.cuposTotales - cupoInfo.cuposReservados : 0);
    handleClose();
  };

  return (
    <Popover
      sx={{ "& .MuiPaper-rounded": { borderRadius: "20px" } }}
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
        <DateRange
          ref={dateRangeRef}
          className={`${state.theme === "dark" ? "CardBooking-calendar" : ""} ${isMobile ? "mobile-calendar" : ""}`}
          locale={es}
          ranges={dateRange}
          onChange={(ranges) => {
            const selected = ranges.selection.startDate;
            handleDateSelection(selected);
          }}
          months={1}
          direction={isMobile ? "vertical" : "horizontal"}
          showDateDisplay={false}
          dayContentRenderer={(date) => (
            <div className={getDayClass(date)}>{date.getDate()}</div>
          )}
        />

        <Typography className={isMobile ? "mobile-calendar-legend" : "calendar-legend"}>
          <ul>
            <li>Disponible</li>
            <li>Dia Seleccionado</li>
          </ul>
        </Typography>
      </Box>
    </Popover>
  );
};

export default BookingCalendarDays;
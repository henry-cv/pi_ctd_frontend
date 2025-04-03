import { Popover, Box, Typography, useMediaQuery } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useRef, useState } from "react";
import "../css/components/BookingCalendar.css";
import { useContextGlobal } from "../gContext/globalContext";
import { es } from "date-fns/locale";
import { funtionsBookingCalendar, normalizeDate } from "../constants/data/funtionsBookingCalendar";

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
  availabilityMap,
  isBooking = {}
}) => {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const { state, dispatch } = useContextGlobal();
  const dateRangeRef = useRef(null);
  const [theDateIsPast, setTheDateIsPast] = useState("");

  const {
    errors,
    getDayClass,
    handleDateSelection,
    handleMonthChange,
    fechas,
    primeraFechaValida,
  } = funtionsBookingCalendar({
    dateRange,
    setDateRange,
    availability,
    setBookingDate,
    bookingDate,
    resetCalendar,
    setResetCalendar,
    availabilityMap,
    state,
    dateRangeRef,
    setTheDateIsPast,
    isBooking,
  });

  // Use a separate effect for dispatch to prevent infinite loops
  useEffect(() => {
    if (theDateIsPast) {
      dispatch({ type: "SET_BOOKINGS_DATES", payload: { pastDate: theDateIsPast } });
    }
  }, [theDateIsPast, dispatch]);

  // Calculate the shown date safely to prevent Invalid Date errors
  const getShownDate = () => {
    if (bookingDate && !isNaN(bookingDate.getTime())) {
      return bookingDate;
    }
    
    if (availability?.type === "dias" && fechas.length > 0 && primeraFechaValida) {
      return primeraFechaValida;
    }
    
    return new Date();
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
            if (ranges.selection && ranges.selection.startDate) {
              const selected = ranges.selection.startDate;
              handleDateSelection(selected);
              handleClose();
            }
          }}
          onShownDateChange={(date) => {
            if (date && !isNaN(date.getTime())) {
              handleMonthChange(date);
            }
          }}
          shownDate={getShownDate()}
          months={1}
          direction={isMobile ? "vertical" : "horizontal"}
          showDateDisplay={false}
          dayContentRenderer={(date) => {
            if (date && !isNaN(date.getTime())) {
              return <div className={getDayClass(date)}>{date.getDate()}</div>;
            }
            return <div>Invalid</div>;
          }}
        />

        {/* Fixed DOM nesting issues by replacing p elements with div */}
        <Typography className={isMobile ? "mobile-calendar-legend" : "calendar-legend"}>
          {errors && <div style={{ color: "red" }}>{errors}</div>}
          <div className="legend-text">Estado de los días</div>
          <ul className="legend">
            <li className="legend-item">
              <span className="legend-color disabled"></span>
              Disponible
            </li>
            <li className="legend-item">
              <span className="legend-color full"></span>
              Cupo lleno
            </li>
            <li className="legend-item">
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
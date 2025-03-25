import { useRef, useState } from "react";
import "../css/components/DateCalendar.css";
import PropTypes from 'prop-types';
import { FaCalendarAlt } from "react-icons/fa";

const DateCalendar = ({ dateChange, selectedDate, eventType, selectedDateEnd, dateEndChange }) => {
  const dateInputRef = useRef(null);
  const dateEndInputRef = useRef(null);
  const [date, setDate] = useState(selectedDate || "");
  const [dateEnd, setDateEnd] = useState(selectedDateEnd || "");

  useEffect(() => {
    const hoy = new Date();
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    if (fechaInicioDate < hoy) {
      setErrorFechaInicio('La fecha de inicio no puede ser anterior al día de hoy');
    } else {
      setErrorFechaInicio(null);
    }

    if (fechaFinDate <= hoy) {
      setErrorFechaFin('La fecha de fin debe ser posterior al día de hoy');
    } else {
      setErrorFechaFin(null);
    }
  }, [fechaInicio, fechaFin]);
  const handleCalendarClick = (ref) => {
    ref.current?.click();
    //refactorizado usando el operador existencial ?.
  };

  const handleDateEndChange = (event) => {
    const dateValue = event.target.value;
    console.log("Fecha seleccionada, en componente DateCalendar: ", dateValue);

    setDateEnd(dateValue);
    dateEndChange(event);
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    console.log("Fecha seleccionada date:", dateValue);

    setDate(dateValue);
    dateChange(event);
  };

  return (
    <div className={`${eventType ? 'current-dates' : ''}`}>

      <div className="container-date">
        <label htmlFor="datePicker">Fecha {eventType === "RECURRENTE" && "Inicio"}:</label>
        <div className="date-picker-container" onClick={() => handleCalendarClick(dateInputRef)}>
          <FaCalendarAlt className="calendar-icon" />
          {date ? (
            <p className="date-placeholder">{date}</p>
          ) : (
            <p className="date-placeholder">Ingrese fechas disponibles</p>
          )}
          <input
            type="date"
            id="datePicker"
            name="fechaEventoInicio"
            className="date-input"
            required
            ref={dateInputRef}
            onChange={(e) => handleDateChange(e)}
            value={date}
          />
        </div>
      </div>
      {eventType === "RECURRENTE" && (
        <div className="container-date">
          <label htmlFor="datePickerEnd">Fecha Fin:</label>
          <div className="date-picker-container" onClick={() => handleCalendarClick(dateEndInputRef)}>
            <FaCalendarAlt className="calendar-icon" />
            {dateEnd ? (
              <p className="date-placeholder">{dateEnd}</p>
            ) : (
              <p className="date-placeholder">Ingrese fechas disponibles</p>
            )}
            <input
              type="date"
              id="datePickerEnd"
              name="fechaEventoFin"
              className="date-input"
              required
              ref={dateEndInputRef}
              onChange={(e) => handleDateEndChange(e)}
              value={dateEnd}
            />
          </div>
          <div />

        </div>
      )}
    </div>
  )
};

DateCalendar.propTypes = {
  dateChange: PropTypes.func.isRequired,
  dateEndChange: PropTypes.func,
  selectedDate: PropTypes.string,
  selectedDateEnd: PropTypes.string,
  eventType: PropTypes.string,
};

export default DateCalendar;

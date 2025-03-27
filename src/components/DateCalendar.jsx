import { useRef, useState, useEffect } from "react";
import "../css/components/DateCalendar.css";
import PropTypes from 'prop-types';
import { FaCalendarAlt } from "react-icons/fa";

const DateCalendar = ({ eventType, setFechaEvento, setFechaFinEvento }) => {
  const dateInputRef = useRef(null);
  const dateEndInputRef = useRef(null);

  const [dateState, setDateState] = useState("");
  const [errorDate, setErrorDate] = useState("");

  const [dateStateEnd, setDateStateEnd] = useState("");
  const [errorDateEnd, setErrorDateEnd] = useState("");
  const TODAY = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setDateState(TODAY);
  }, []);

  const isValidDate = (date, type) => {
    const dateValue = new Date(date);
    if (type === 'start') {
      return dateValue < new Date(TODAY) ? 'Fecha de inicio debe ser igual o posterior al día de hoy' : null;
    } else if (type === 'end') {
      return dateValue <= new Date(TODAY) || dateValue <= new Date(dateState) ? 'La fecha de fin debe ser posterior al día de inicio' : null;
    }
  };

  useEffect(() => {
    const error = isValidDate(dateState, 'start');
    setErrorDate(error);
  }, [dateState]);

  useEffect(() => {
    const error = isValidDate(dateStateEnd, 'end');
    setErrorDateEnd(error);
  }, [dateStateEnd, dateState]);

  const handleCalendarClick = (ref) => {
    ref.current?.click();
  };

  const handleDateEndChange = (event) => {
    const dateValue = event.target.value;
    setDateStateEnd(dateValue);
    if (!isValidDate(dateValue, 'end')) {
      setFechaFinEvento(dateValue);
    }
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    setDateState(dateValue);
    if (!isValidDate(dateValue, 'start')) {
      setFechaEvento(dateValue);
    }
  };
  return (
    <div className={`${eventType ? 'current-dates' : ''}`}>

      <div className="container-date">
        <label htmlFor="datePicker">Fecha {eventType === "RECURRENTE" && "Inicio"}:</label>
        <div className="date-picker-container" onClick={() => handleCalendarClick(dateInputRef)}>
          <FaCalendarAlt className="calendar-icon" />
          {dateState ? (
            <p className="date-placeholder">{dateState}</p>
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
            value={dateState}
          />
        </div>
        {errorDate && <p className="error-message">{errorDate}</p>}
      </div>
      {eventType === "RECURRENTE" && (
        <div className="container-date">
          <label htmlFor="datePickerEnd">Fecha Fin:</label>
          <div className="date-picker-container" onClick={() => handleCalendarClick(dateEndInputRef)}>
            <FaCalendarAlt className="calendar-icon" />
            {dateStateEnd ? (
              <p className="date-placeholder">{dateStateEnd}</p>
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
              value={dateStateEnd}
            />
          </div>
          {errorDateEnd && <p className="error-message">{errorDateEnd}</p>}
        </div>
      )}
    </div>
  )
};

DateCalendar.propTypes = {
  eventType: PropTypes.string,
  setFechaEvento: PropTypes.func,
  setFechaFinEvento: PropTypes.func,
};

export default DateCalendar;

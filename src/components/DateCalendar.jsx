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

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
    // Obtiene una nueva fecha en formato "2023-03-15T14:30:00.000Z" se le quita la parte de la hora
  };

  //Para asignar la fecha actual, a la fechaInicio
  useEffect(() => {
    setDateState(getTodayDate());
  }, []);

  // Función para validar la fecha de Inicio
  const validateStartDate = (startDate) => {
    const today = new Date();
    const startDateValue = new Date(startDate);
    if (startDateValue < today) {
      return 'Fecha de inicio debe ser igual o posterior al día de hoy';
    }
    return null;
  };
  //Use Effect para validar la fecha de Inicio
  useEffect(() => {
    const error = validateStartDate(dateState);
    setErrorDate(error);
  }, [dateState]);

  // Función para validar la fecha de Fin
  const validateEndDate = (endDate) => {
    const today = new Date();
    const endDateValue = new Date(endDate);
    if (endDateValue <= today) {
      return 'La fecha de fin debe ser posterior al día de hoy';
    }
    return null;
  };
  //Use Effect para validar la fecha de Fin
  useEffect(() => {
    const error = validateEndDate(dateStateEnd);
    setErrorDateEnd(error);
  }, [dateStateEnd]);

  //Manejador de click en la ref de calendar
  const handleCalendarClick = (ref) => {
    ref.current?.click();
    //refactorizado usando el operador existencial ?.
  };

  const handleDateEndChange = (event) => {
    const dateValue = event.target.value;
    console.log("Fecha seleccionada Fin, en componente DateCalendar: ", dateValue);
    setDateStateEnd(dateValue);
    if (validateEndDate(dateValue)) {
      setFechaFinEvento(dateValue);
    };
  };

  const handleDateChange = (event) => {
    const dateValue = event.target.value;
    console.log("Fecha seleccionada Inicio, en componente DateCalendar: ", dateValue);
    setDateState(dateValue);
    if (validateEndDate(dateValue)) {
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

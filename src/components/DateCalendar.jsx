import { useRef, useState } from "react";
import "../css/DateCalendar.css";
import PropTypes from 'prop-types';
import { FaCalendarAlt } from "react-icons/fa";

const DateCalendar = ({ onChange }) => {
  const dateInputRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");


  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.click();
    }
  }
  // const handleCalendarClick = () => {
  //   document.getElementById("datePicker").click();
  // };
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    onChange(event); // Llama al manejador onChange pasado desde el componente padre
  };

  return (
    <div className="container-date">
      <label htmlFor="datePicker">Fecha:</label>
      <div className="date-picker-container" onClick={handleCalendarClick}>
        <FaCalendarAlt className="calendar-icon" />
        {selectedDate ? (
          <p className="date-placeholder">{selectedDate}</p>
        ) : (
          <p className="date-placeholder">Ingrese fechas disponibles</p>
        )}
        <input
          type="date"
          id="datePicker"
          name="fechaEvento"
          className="date-input"
          required
          ref={dateInputRef}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

DateCalendar.propTypes = {
  onChange: PropTypes.func.isRequired,
};
export default DateCalendar;
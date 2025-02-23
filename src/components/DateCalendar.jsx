import { useRef } from "react";
import "../css/DateCalendar.css";
import PropTypes from 'prop-types';
import { FaCalendarAlt } from "react-icons/fa";

const DateCalendar = ({ onChange }) => {
  const dateInputRef = useRef(null);

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.click();
    }
  }
  // const handleCalendarClick = () => {
  //   document.getElementById("datePicker").click();
  // };

  return (
    <div className="container-date">
      <label htmlFor="datePicker">Fecha:</label>
      <div className="date-picker-container" onClick={handleCalendarClick}>
        <FaCalendarAlt className="calendar-icon" />
        <p className="date-placeholder">Ingrese fechas disponibles</p>
        <input type="date" id="datePicker" name="fechaEvento" className="date-input" required ref={dateInputRef} onChange={onChange} />
      </div>
    </div>
  );
};

DateCalendar.propTypes = {
  onChange: PropTypes.func.isRequired,
};
export default DateCalendar;
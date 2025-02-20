import "../css/DateCalendar.css";
import { FaCalendarAlt } from "react-icons/fa";

const DateCalendar = () => {
  const handleCalendarClick = () => {
    document.getElementById("datePicker").click();
  };

  return (
    <div className="container-date">
      <label htmlFor="datePicker">Fecha:</label>
      <div className="date-picker-container" onClick={handleCalendarClick}>
        <FaCalendarAlt className="calendar-icon" />
        <p className="date-placeholder">Ingrese fechas disponibles</p>
        <input type="date" id="datePicker" name="fechaEvento" className="date-input" required />
      </div>
    </div>
  );
};

export default DateCalendar;
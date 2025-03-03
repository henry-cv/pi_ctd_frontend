import { useRef, useState } from "react";
import "../css/components/DateCalendar.css";
import PropTypes from 'prop-types';
import { FaCalendarAlt } from "react-icons/fa";

const DateCalendar = ({ onChange, selectedDate }) => {
  const dateInputRef = useRef(null);
  const [date, setDate] = useState(selectedDate || "");


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
    setDate(date);
    onChange(event); // Llama al manejador onChange pasado desde el componente padre
  };

  return (
    <div className="container-date">
      <label htmlFor="datePicker">Fecha:</label>
      <div className="date-picker-container" onClick={handleCalendarClick}>
        <FaCalendarAlt className="calendar-icon" />
        {date ? (
          <p className="date-placeholder">{date}</p>
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
          value={date}
        />
      </div>
    </div>
  );
};

DateCalendar.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedDate: PropTypes.string
};
export default DateCalendar;
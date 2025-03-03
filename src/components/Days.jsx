import "../css/components/Days.css";
import { useState } from "react";
import PropTypes from "prop-types";

const daysOfWeek = [
  { value: "LUNES", label: "Lun" },
  { value: "MARTES", label: "Mar" },
  { value: "MIERCOLES", label: "Mie" },
  { value: "JUEVES", label: "Jue" },
  { value: "VIERNES", label: "Vie" },
  { value: "SABADO", label: "Sab" },
  { value: "DOMINGO", label: "Dom" },
];
const Days = ({ onChange, selectedDays }) => {

  const [days, setDays] = useState(selectedDays || []);

  const handleDayChange = (day) => {
    const newDays = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setDays(newDays);
    onChange(newDays); // Aquí se envían los días seleccionados al componente padre
  };

  return (
    <div className="container-days">
      <label>Días de la semana:</label>
      <div className="days-checkboxes">
        {daysOfWeek.map((day) => (
          < label key={day.value} >
            <input
              type="checkbox"
              name="days"
              value={day.value}
              checked={days.includes(day.value)}
              onChange={() => handleDayChange(day.value)}
            />
            {day.label}
          </label>
        ))}
      </div>
    </div >
  );
};
Days.propTypes = {
  onChange: PropTypes.func,
  selectedDays: PropTypes.array
}

export default Days;
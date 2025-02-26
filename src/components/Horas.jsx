import { useState } from 'react';
import "../css/Horas.css";
import PropTypes from 'prop-types';

const Horas = ({ onHoraInicioChange, onHoraFinChange }) => {
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const handleHoraInicioChange = (event) => {
    const value = event.target.value;
    setHoraInicio(value);
    onHoraInicioChange(event);
  };

  const handleHoraFinChange = (event) => {
    const value = event.target.value;
    setHoraFin(value);
    onHoraFinChange(event);
  };

  return (
    <div className="container-hours">
      <label>Hora:</label>
      <div className="time-inputs">
        <input
          type="time"
          id="startTime"
          name="horaInicio"
          className="time-input"
          value={horaInicio}
          onChange={handleHoraInicioChange}
          required
        />
        <label>A</label>
        <input
          type="time"
          id="endTime"
          name="horaFin"
          className="time-input"
          value={horaFin}
          onChange={handleHoraFinChange}
          required
        />
      </div>
    </div>
  );
};

// Validación de tipos de props
Horas.propTypes = {
  onHoraInicioChange: PropTypes.func.isRequired,
  onHoraFinChange: PropTypes.func.isRequired,
};

export default Horas;
import { useState } from 'react';
import "../css/components/Horas.css";
import PropTypes from 'prop-types';

const Horas = ({ onHoraInicioChange, onHoraFinChange, horaInicio, horaFin }) => {
  const [horaInicioState, setHoraInicioState] = useState(horaInicio || "");
  const [horaFinState, setHoraFinState] = useState(horaFin || "");

  const handleHoraInicioChange = (event) => {
    const value = event.target.value;
    setHoraInicioState(value);
    onHoraInicioChange(event);
  };

  const handleHoraFinChange = (event) => {
    const value = event.target.value;
    setHoraFinState(value);
    onHoraFinChange(event);
  };

  return (
    <div className="container-hours">
      <label>Hora:</label>
      <div className="time-inputs"  >
        <input
          type="time"
          id="startTime"
          name="horaInicio"
          className="time-input"
          value={horaInicioState}
          onChange={handleHoraInicioChange}
          required
        />
        <label>A</label>
        <input
          type="time"
          id="endTime"
          name="horaFin"
          className="time-input"
          value={horaFinState}
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
  horaInicio: PropTypes.string,
  horaFin: PropTypes.string
};

export default Horas;
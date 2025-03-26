import { useState, useEffect } from 'react';
import "../css/components/Horas.css";
import PropTypes from 'prop-types';

const Horas = ({ onHoraInicioChange, onHoraFinChange, horaInicio, horaFin }) => {
  const [horaInicioState, setHoraInicioState] = useState(horaInicio || "");
  const [horaFinState, setHoraFinState] = useState(horaFin || "");
  const [error, setError] = useState("");

  // Función para obtener la hora actual en formato HH:mm
  const obtenerHoraActual = () => {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  // Efecto para establecer la hora actual al montar el componente
  useEffect(() => {
    if (!horaInicio) {
      const horaActual = obtenerHoraActual();
      setHoraInicioState(horaActual);
      onHoraInicioChange({ target: { value: horaActual, name: 'horaInicio' } });
    }
  }, []);

  const handleHoraInicioChange = (event) => {
    const value = event.target.value;
    setHoraInicioState(value);
    onHoraInicioChange(event);
    validarHoras(value, horaFinState);
  };

  const handleHoraFinChange = (event) => {
    const value = event.target.value;
    setHoraFinState(value);
    onHoraFinChange(event);
    validarHoras(horaInicioState, value);
  };
  const validarHoras = (inicio, fin) => {
    if (inicio && fin) {
      if (inicio >= fin) {
        setError("La hora de fin no puede ser menor o igual a la hora de inicio");
        return false;
      }
    }
    setError("");
    return true;
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
      {error && (
        <p className="time-error">{error}</p>
      )}
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
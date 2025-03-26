import { useState, useEffect } from 'react';
import "../css/components/Horas.css";
import PropTypes from 'prop-types';

const Horas = ({ setHoraInicio, setHoraFin }) => {
  const [horaInicioState, setHoraInicioState] = useState("");
  const [horaFinState, setHoraFinState] = useState("");
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
    if (!horaInicioState) {
      const horaActual = obtenerHoraActual();
      setHoraInicioState(horaActual);
    }
  }, []);

  const handleHoraInicioChange = (event) => {
    const value = `${event.target.value}:00`;
    console.log("hora Inicio en Horas.jsx ", value);
    setHoraInicioState(value);
    if (validarHoras(value, horaFinState)) setHoraInicio(value);
  };

  const handleHoraFinChange = (event) => {
    const value = `${event.target.value}:00`;
    console.log("hora Fin en Horas.jsx ", value);
    setHoraFinState(value);
    if (validarHoras(horaInicioState, value)) setHoraFin(value);
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
  setHoraInicio: PropTypes.func.isRequired,
  setHoraFin: PropTypes.func.isRequired,
};

export default Horas;
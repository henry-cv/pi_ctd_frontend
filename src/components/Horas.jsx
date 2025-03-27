import { useState, useEffect } from 'react';
import "../css/components/Horas.css";
import PropTypes from 'prop-types';

const Horas = ({ horaInicio, setHoraInicio, setHoraFin, horaFin }) => {
  const [horaInicioState, setHoraInicioState] = useState(horaInicio || "");
  const [horaFinState, setHoraFinState] = useState(horaFin || "");
  const [error, setError] = useState("");

  // Función para obtener la hora actual en formato HH:mm
  /* const obtenerHoraActual = () => {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    // guarda el valor de horas en formato dos dígitos si hace falta un 0 lo agrega a la izquierda
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}:00`;
  }; */

  // Sincroniza los valores iniciales cuando cambian (por ejemplo, al editar)
  useEffect(() => {
    setHoraInicioState(horaInicio || "");
    setHoraFinState(horaFin || "");
  }, [horaInicio, horaFin]);

  // Establece la hora actual al montar el componente si no hay valores iniciales
  /*  useEffect(() => {
     if (!horaInicioState && !horaFinState) {
       const horaActual = obtenerHoraActual();
       setHoraInicioState(horaActual);
     }
   }, [horaInicioState, horaFinState]); */

  // Maneja el cambio de la hora de inicio
  const handleHoraInicioChange = (event) => {
    const value = `${event.target.value}:00`; // Agrega los segundos al valor
    setHoraInicioState(value);
    if (validarHoras(value, horaFinState)) {
      setHoraInicio(value); // Actualiza el estado del padre
    }
  };

  // Maneja el cambio de la hora de fin
  const handleHoraFinChange = (event) => {
    const value = `${event.target.value}:00`; // Agrega los segundos al valor
    setHoraFinState(value);
    if (validarHoras(horaInicioState, value)) {
      setHoraFin(value); // Actualiza el estado del padre
    }
  };

  // Valida que la hora de inicio sea menor que la de fin
  const validarHoras = (inicio, fin) => {
    if (inicio && fin) {
      if (inicio >= fin) {
        setError("La hora de fin no puede ser menor o igual a la hora de inicio.");
        return false;
      }
    }
    setError(""); // Limpia el error si todo es válido
    return true;
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
          value={horaInicioState.slice(0, 5)} // Muestra solo HH:mm
          onChange={handleHoraInicioChange}
          required
        />
        <label>A</label>
        <input
          type="time"
          id="endTime"
          name="horaFin"
          className="time-input"
          value={horaFinState.slice(0, 5)} // Muestra solo HH:mm
          onChange={handleHoraFinChange}
          required
        />
      </div>
      {error && <p className="time-error">{error}</p>}
    </div>
  );
};

// Validación de tipos de props
Horas.propTypes = {
  horaInicio: PropTypes.string,
  horaFin: PropTypes.string,
  setHoraInicio: PropTypes.func.isRequired,
  setHoraFin: PropTypes.func.isRequired,
};

export default Horas;

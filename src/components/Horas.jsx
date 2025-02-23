import "../css/Horas.css";
import PropTypes from 'prop-types';

const Horas = ({ onHoraInicioChange, onHoraFinChange }) => {
  return (
    <div className="container-hours">
      <label>Hora:</label>
      <div className="time-inputs">
        <input type="time" id="startTime" name="horaInicio" className="time-input" onChange={onHoraInicioChange} required />
        <label>A</label>
        <input type="time" id="endTime" name="horaFin" className="time-input" onChange={onHoraFinChange} required />
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
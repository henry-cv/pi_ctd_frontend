import "../css/Horas.css";

const Horas = ({onHoraInicioChange, onHoraFinChange}) => {
  return (
    <div className="container-hours">
      <label>Hora:</label>
      <div className="time-inputs">
        <input type="time" id="startTime" name="startTime" className="time-input" onChange={onHoraInicioChange} required />
        <label>A</label>
        <input type="time" id="endTime" name="endTime" className="time-input" onChange={onHoraFinChange} required />
      </div>
    </div>
  );
};

export default Horas;
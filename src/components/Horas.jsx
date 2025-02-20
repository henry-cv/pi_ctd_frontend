import "../css/Horas.css";

const Horas = () => {
  return (
    <div className="container-hours">
      <label>Hora:</label>
      <div className="time-inputs">
        <input type="time" id="startTime" name="startTime" className="time-input" required />
        <label>A</label>
        <input type="time" id="endTime" name="endTime" className="time-input" required />
      </div>
    </div>
  );
};

export default Horas;
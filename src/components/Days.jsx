import "../css/components/Days.css";

const Days = () => {
  return (
    <div className="container-days">
      <label>Días de la semana:</label>
      <div className="days-checkboxes">
        <label>
          <input type="checkbox" name="days" value="LUNES" /> Lun
        </label>
        <label>
          <input type="checkbox" name="days" value="MARTES" /> Mar
        </label>
        <label>
          <input type="checkbox" name="days" value="MIERCOLES" /> Mie
        </label>
        <label>
          <input type="checkbox" name="days" value="JUEVES" /> Jue
        </label>
        <label>
          <input type="checkbox" name="days" value="VIERNES" /> Vie
        </label>
        <label>
          <input type="checkbox" name="days" value="SABADO" /> Sab
        </label>
        <label>
          <input type="checkbox" name="days" value="DOMINGO" /> Dom
        </label>
      </div>
    </div>
  );
};

export default Days;
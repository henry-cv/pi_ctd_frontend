import "../css/components/PanelControl.css";
import PurpleHeart from '/Purpleheart.png';
import YellowHeart from '/YellowHeart.png';
import CataVino from '/CataVino.png';

const PanelControl = () => {
  return (
    <div className="dashboard-main">
      {/* Título principal del Panel de Control */}
      <div className="dashboard-title">Panel de Control</div>

      <div className="stats">
        <div className="stat-card">
          <img src={PurpleHeart} alt="Total Ventas" className="stat-icon" />
          <div>
            <h3>Total Ventas</h3>
            <p>$7500k</p>
          </div>
        </div>
        <div className="stat-card">
          <img src={YellowHeart} alt="Total Reservas" className="stat-icon" />
          <div>
            <h3>Total Reservas</h3>
            <p>100</p>
          </div>
        </div>
        <div className="stat-card">
          <img src={YellowHeart} alt="Nuevos usuarios" className="stat-icon" />
          <div>
            <h3>Nuevos usuarios</h3>
            <p>5</p>
          </div>
        </div>
      </div>

      <div className="activities">
        <h2>Actividades más vendidas</h2>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Actividad</th>
              <th>Precio</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {[{ id: 1, cantidad: 25 }, { id: 2, cantidad: 12 }, { id: 3, cantidad: 5 }].map((actividad) => (
              <tr key={actividad.id}>
                <td>{actividad.id}</td>
                <td className="activity-cell">
                  <img src={CataVino} alt="Cata de Vinos" className="activity-img" />
                  Cata de Vinos
                </td>
                <td>$75</td>
                <td>{actividad.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelControl;

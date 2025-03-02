import "../css/components/PanelControl.css";
import PurpleHeart from '/Purpleheart.png';
import YellowHeart from '/YellowHeart.png';
import CataVino from '/CataVino.png';
import ModalAviso from "./ModalAviso"; // Importar ModalAviso
import { useState } from "react";

const PanelControl = () => {
  const [showModal, setShowModal] = useState(true); // Estado para controlar la visibilidad del modal

  const handleCloseModal = () => {
    setShowModal(false); // Ocultar el modal cuando se cierre
  };

  return (
    <div className="dashboard-main">
      {/* Mostrar ModalAviso solo si showModal es true */}
      {showModal && <ModalAviso onClose={handleCloseModal} />}

      {/* Título principal */}
      <div className="dashboard-title">Panel de Control</div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <img src={PurpleHeart} alt="Total Ventas" className="stat-icon" />
          <div className="stat-info">
            <h3>Total Ventas</h3>
            <p>$7500k</p>
          </div>
        </div>
        <div className="stat-card">
          <img src={YellowHeart} alt="Total Reservas" className="stat-icon" />
          <div className="stat-info">
            <h3>Total Reservas</h3>
            <p>100</p>
          </div>
        </div>
        <div className="stat-card">
          <img src={YellowHeart} alt="Nuevos usuarios" className="stat-icon" />
          <div className="stat-info">
            <h3>Nuevos usuarios</h3>
            <p>5</p>
          </div>
        </div>
      </div>

      {/* Actividades */}
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
                  <span>Cata de Vinos</span>
                </td>
                <td>$75</td>
                <td>{actividad.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Info - Solo en mobile */}
      <div className="info-card">
        <p>Para acceder a todas las funciones de administración, usa la versión de escritorio.</p>
        <a href="https://gobook-dh.vercel.app/administrador/panel" target="_blank" rel="noopener noreferrer">
          Ir a la versión de escritorio
        </a>
      </div>
    </div>
  );
};

export default PanelControl;

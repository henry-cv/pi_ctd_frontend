import { useState } from "react";
import { Link } from "react-router-dom";
import { useContextGlobal } from "../gContext/globalContext";
import "../css/pages/dashboard.css";
import "../css/components/DashAjustes.css";

const DashAjustes = () => {
  const { state } = useContextGlobal();
  const [showDropdown, setShowDropdown] = useState(false);
  const isAdmin = state.user?.usuarioRoles === "ADMIN";

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="ajustes-container">
      <h1 className="dark_activities">Ajustes</h1>
      
      <div className="ajustes-menu">
        {isAdmin && (
          <>
            <div className="ajustes-item" onClick={toggleDropdown}>
              <span>Permisos</span>
              <div className={`arrow-icon ${showDropdown ? 'open' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            
            {showDropdown && (
              <div className="ajustes-dropdown">
                <Link to="/administrador/ajustes/asignar-rol" className="dropdown-item">
                  Asignar Rol
                </Link>
              </div>
            )}
          </>
        )}
        
        <div className="ajustes-item">
          <span>Preferencias</span>
          <div className="coming-soon-badge">Próximamente</div>
        </div>
        
        <div className="ajustes-item">
          <span>Configuración de Cuenta</span>
          <div className="coming-soon-badge">Próximamente</div>
        </div>
      </div>
      
      <div className="info-message">
        <p>Estamos trabajando para añadir más opciones de configuración. ¡Gracias por tu paciencia!</p>
      </div>
    </div>
  );
};

export default DashAjustes;
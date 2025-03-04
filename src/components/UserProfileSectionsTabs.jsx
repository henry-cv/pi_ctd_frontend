import "../css/components/UserProfileSectionsTabs.css";
import { useContextGlobal } from "../gContext/globalContext";

function UserProfileSectionsTabs() {
    const { state, dispatch } = useContextGlobal();
 
    function handleActive(tab) {
        dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
      }
      
  return (
    <div className="profile-tabs">
      <button 
        className={`tab-button ${state.activeTab === "edit-profile" ? "active" : ""}`} 
        onClick={() => handleActive("edit-profile")}
      >
        Editar Perfil
      </button>
      <button 
        className={`tab-button ${state.activeTab === "reservations" ? "active" : ""}`} 
        onClick={() => handleActive("reservations")}
      >
        Mis Reservas
      </button>
      <button 
        className={`tab-button ${state.activeTab === "favorites" ? "active" : ""}`} 
        onClick={() => handleActive("favorites")}
      >
        Mis Favoritos
      </button>
  </div>

  )
}

export default UserProfileSectionsTabs
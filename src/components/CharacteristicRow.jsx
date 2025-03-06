import { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import * as FaIcons from "react-icons/fa";
import PropTypes from 'prop-types';
import { useContextGlobal } from "../gContext/globalContext";
import Swal from "sweetalert2";

const CharacteristicRow = ({ id, nombre, icono, onDelete, onUpdate }) => {
  const { state } = useContextGlobal();
  const [isDeleting, setIsDeleting] = useState(false);

  // Determinar qué icono mostrar
  let IconComponent = FaIcons.FaHeart; // Valor por defecto

  if (icono && typeof icono === 'string' && icono in FaIcons) {
    IconComponent = FaIcons[icono];
  }

  const handleDelete = async () => {
    // Confirmación con SweetAlert2
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      setIsDeleting(true);

      try {
        const token = state.token || localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }

        const response = await fetch(`/api/caracteristica/eliminar?id=${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error al eliminar: ${response.status}`);
        }

        onDelete && onDelete(id);
        
        Swal.fire(
          "Eliminado",
          "La característica ha sido eliminada correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error eliminando la característica:", error);
        
        Swal.fire(
          "Error",
          "No se pudo eliminar la característica. " + error.message,
          "error"
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="RegisterCharacteristic RegisterActivitie grid-2-cols">
      <div className="infoCharacteristic infoActivitie">
        <input type="checkbox" className="inputCharacteristic inputActivitie" />
        <div className="characteristic-icon-container" style={{ width: '50px', textAlign: 'center' }}>
          <IconComponent size={24} />
        </div>
        <p>{nombre}</p>
      </div>
      <div className="btn_action">
        <button 
          className="btn_blueAction" 
          onClick={onUpdate}
          disabled={isDeleting}
        >
          <FaEdit size={"1.2rem"} />
        </button>
        <button 
          className="btn_redAction" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <RiDeleteBin5Fill size={"1.2rem"} />
        </button>
      </div>
    </div>
  );
};

CharacteristicRow.propTypes = {
  id: PropTypes.number.isRequired,
  nombre: PropTypes.string.isRequired,
  icono: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func
};

export default CharacteristicRow;
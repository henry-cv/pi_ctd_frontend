import { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as IoIcons from "react-icons/io5";
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SchoolIcon from '@mui/icons-material/School';
import KayakingIcon from '@mui/icons-material/Kayaking';
import InsightsIcon from '@mui/icons-material/Insights';
import PropTypes from 'prop-types';
import { useContextGlobal } from "../gContext/globalContext";
import Swal from "sweetalert2";

// Material UI icon mapping
const muiIcons = {
  'FlashlightOnIcon': FlashlightOnIcon,
  'SelfImprovementIcon': SelfImprovementIcon,
  'SchoolIcon': SchoolIcon,
  'KayakingIcon': KayakingIcon,
  'InsightsIcon': InsightsIcon
};

const CharacteristicRow = ({ id, nombre, icono, onDelete, onUpdate }) => {
  const { state } = useContextGlobal();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get the correct icon component based on the icon name
  const getIconComponent = (iconName) => {
    if (!iconName) return FaIcons.FaHeart; // Default icon
    
    // Check for Font Awesome (FA) icons
    if (iconName.startsWith("Fa") && !iconName.startsWith("Fa6")) {
      return iconName in FaIcons ? FaIcons[iconName] : FaIcons.FaHeart;
    }
    
    // Check for Font Awesome 6 (FA6) icons
    if (iconName.startsWith("Fa6") || (iconName.startsWith("Fa") && !(iconName in FaIcons))) {
      const fa6Name = iconName.startsWith("Fa6") ? iconName.substring(3) : iconName;
      return fa6Name in Fa6Icons ? Fa6Icons[fa6Name] : FaIcons.FaHeart;
    }
    
    // Check for Ionicons (IO5) icons
    if (iconName.startsWith("Io")) {
      return iconName in IoIcons ? IoIcons[iconName] : FaIcons.FaHeart;
    }
    
    // Check for Material UI icons
    if (iconName.endsWith("Icon")) {
      return iconName in muiIcons ? muiIcons[iconName] : FaIcons.FaHeart;
    }
    
    // Default to FaHeart if no match found
    return FaIcons.FaHeart;
  };

  // Determine which icon to show
  const IconComponent = getIconComponent(icono);

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
          "success",
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
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormNewCharacteristic from './FormNewCharacteristic';
import { useContextGlobal } from "../gContext/globalContext";
import Swal from "sweetalert2";

const EditCharacteristic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: globalState } = useContextGlobal();
  const characteristicId = location.state?.characteristicId;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [characteristicData, setCharacteristicData] = useState(null);
  
  useEffect(() => {
    if (!characteristicId) {
      Swal.fire({
        title: "Error",
        text: "No se ha proporcionado ID de característica a editar",
        icon: "error",
        confirmButtonColor: "#3e10da",
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
        }
      }).then(() => {
        navigate('/administrador/caracteristicas');
      });
      return;
    }
    
    const fetchCharacteristicData = async () => {
      try {
        setLoading(true);
        
        const token = globalState.token || localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }
        
        const response = await fetch(`/api/caracteristica/${characteristicId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al obtener la característica: ${response.status}`);
        }
        
        const data = await response.json();
        setCharacteristicData(data);
      } catch (error) {
        console.error("Error cargando datos de la característica:", error);
        setError(error.message);
        
        Swal.fire({
          title: "Error",
          text: `No se pudo cargar la característica: ${error.message}`,
          icon: "error",
          confirmButtonColor: "#3e10da",
          customClass: {
            popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
          }
        }).then(() => {
          navigate('/administrador/caracteristicas');
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCharacteristicData();
  }, [characteristicId, navigate, globalState.token]);
  
  if (loading) {
    return <div className="loading">Cargando datos de la característica...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="edit-characteristic-container">
      <h2 className="section-title">Editar Característica</h2>
      {characteristicData && (
        <FormNewCharacteristic 
          isEditMode={true} 
          initialData={characteristicData} 
        />
      )}
    </div>
  );
};

export default EditCharacteristic;
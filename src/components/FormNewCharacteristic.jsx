import { useState } from "react";
import "../css/components/FormNewCharacteristic.css";
import "../css/global/variables.css";
import ButtonBluePill from "./ButtonBluePill";
import FieldError from "./FieldError";
import { validarTexto } from "../utils/utils";
import IconSelector from "./IconSelector";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useContextGlobal } from "../gContext/globalContext";

const FormNewCharacteristic = ({ isEditMode = false, initialData = null }) => {
  const navigate = useNavigate();
  const { state } = useContextGlobal();
  
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "",
    icono: initialData?.icono || ""
  });
  
  const [errors, setErrors] = useState({
    nombre: "",
    icono: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleIconSelect = (iconName) => {
    setFormData({
      ...formData,
      icono: iconName
    });
    // Limpiar error si existía
    if (errors.icono) {
      setErrors({
        ...errors,
        icono: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (!validarTexto(formData.nombre, 50)) {
      newErrors.nombre = "El nombre debe tener entre 4 y 50 caracteres, sin números o caracteres especiales";
    }
    
    // Validar icono
    if (!formData.icono) {
      newErrors.icono = "Debe seleccionar un icono";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = state.token || localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      
      const endpoint = isEditMode 
        ? `/api/caracteristica/actualizar/${initialData.id}` 
        : "/api/caracteristica/registrar";
      
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
      }
      
      Swal.fire({
        title: isEditMode ? "¡Característica Actualizada!" : "¡Característica Creada!",
        text: `La característica se ha ${isEditMode ? "actualizado" : "guardado"} correctamente.`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        navigate("/administrador/caracteristicas");
      });
      
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        title: "Error",
        text: `Error al ${isEditMode ? "actualizar" : "crear"} la característica: ${error.message}`,
        icon: "error",
        confirmButtonColor: "#D61B1B",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      className="form-base new-characteristic" 
      onSubmit={handleSubmit}
    >
      <div className="container-title">
        <label htmlFor="characteristic-name">Nombre Característica</label>
        <input
          id="characteristic-name"
          type="text"
          placeholder="Ingresa nombre de la característica"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required 
        />
        {errors.nombre && <FieldError message={errors.nombre} />}
      </div>
      
      <div className="container-icon">
        <label htmlFor="characteristic-icon">Icono</label>
        <IconSelector 
          onSelectIcon={handleIconSelect} 
          selectedIcon={formData.icono} 
        />
        {errors.icono && <FieldError message={errors.icono} />}
      </div>
      
      <div className="div-submit">
        <ButtonBluePill
          text="Cancelar"
          className="button-yellow btn-preview"
          type="button"
          onClick={() => navigate("/administrador/caracteristicas")}
        />
        <ButtonBluePill
          text={isSubmitting ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
          className="button-blue btn-save"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default FormNewCharacteristic;
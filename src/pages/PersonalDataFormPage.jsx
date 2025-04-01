import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Typography, 
  TextField, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Container,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContextGlobal } from "../gContext/globalContext";
import NavDash from "../components/NavDash";
import ActivityInfoCard from "../components/ActivitySummaryCard";
import ReservationDetailsCard from "../components/ReservationDetailsCard";
import ButtonBluePill from "../components/ButtonBluePill";
import Footer from "../components/Footer";
import "../css/pages/PersonalDataFormPage.css";
import { RiH2 } from "react-icons/ri";

const PersonalDataFormPage = () => {
  const { state } = useContextGlobal();
  const navigate = useNavigate();
  const { theActivity } = state.activity || {};
  const { reservation } = state;
  const { user } = state;

  // Obtener la última reserva del array de reservas
  const currentReservation = reservation?.length > 0 
    ? reservation[reservation.length - 1] 
    : null;

  // Pasos para el stepper
  const steps = ['Tu actividad elegida', 'Tus datos', 'Confirmación'];

  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    email: user?.email || "",
    telefono: ""
  });
  
  // Estado para validación
  const [errors, setErrors] = useState({});

  // Efectos
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || ""
      });
    }
  }, [user]);

  // Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePreviousStep = () => {
    navigate(`/actividad/${theActivity.id}`);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }
    
    // Make sure we have valid data to pass
    if (!currentReservation || !theActivity) {
      console.error("Missing reservation or activity data");
      alert("Error: No hay información de reserva disponible. Por favor, intenta nuevamente.");
      return;
    }
    
    // Debug: Log the current reservation structure
    console.log("Current reservation structure before enhancement:", JSON.stringify(currentReservation, null, 2));
    
    // Find disponibilidadId with extensive fallbacks
    let disponibilidadId = currentReservation.disponibilidadId || 
                          currentReservation.disponibilidadProductoId || 
                          currentReservation.disponibilidad?.id ||
                          currentReservation.disponibilidadProducto?.id;
    
    // If still not found, check for nested objects that might contain it
    if (!disponibilidadId) {
      Object.keys(currentReservation).forEach(key => {
        if (typeof currentReservation[key] === 'object' && currentReservation[key] !== null) {
          if (currentReservation[key].id && key.toLowerCase().includes('disponibilidad')) {
            disponibilidadId = currentReservation[key].id;
            console.log(`Found disponibilidadId in nested property ${key}.id:`, disponibilidadId);
          }
        }
      });
    }
    
    // For fallback/testing: If we have activity ID and still no disponibilidadId, create a placeholder
    // In a production environment, you would want to redirect the user to select a date instead
    if (!disponibilidadId && theActivity?.id) {
      console.warn("No disponibilidadId found, creating a placeholder ID for development purposes");
      disponibilidadId = parseInt(theActivity.id) * 1000 + Math.floor(Math.random() * 1000);
    }
    
    // Ensure reservation has the proper structure expected by the backend
    const enhancedReservation = {
      ...currentReservation,
      // Ensure we have the disponibilidadId under all possible property names for maximum compatibility
      disponibilidadId: disponibilidadId,
      disponibilidadProductoId: disponibilidadId,
      cantidadPersonas: currentReservation.cantidadPersonas || 1,
      // Add a flag to indicate this is for testing if applicable
      testMode: !disponibilidadId || window.location.hostname === 'localhost'
    };
    
    // Log data being passed for debugging
    console.log("Navigating to confirmation with data:", {
      formData,
      enhancedReservation,
      theActivity
    });
    
    // Store data in sessionStorage as a backup
    sessionStorage.setItem('formData', JSON.stringify(formData));
    sessionStorage.setItem('currentReservation', JSON.stringify(enhancedReservation));
    sessionStorage.setItem('theActivity', JSON.stringify(theActivity));
    
    // Use React Router's state to pass data to the next page
    navigate("/confirmar-reserva", { 
      state: { 
        formData,
        reservation: enhancedReservation,
        activity: theActivity
      },
      replace: false // Ensure we're not replacing history
    });
  };

  if (!theActivity || !currentReservation) {
    return (
      <div className="personal-data-container">
        <Typography variant="h5" className="error-message">
          No hay información de reserva disponible.
        </Typography>
        <ButtonBluePill 
          text="Volver al inicio" 
          className="button-blue" 
          onClick={() => navigate("/")} 
        />
      </div>
    );
  }

  return (
    <div className={`personal-data-page ${state.theme ? "dark" : ""}`}>
      <NavDash variant="home" />
      
      <div className="personal-data-container">
        <div className="breadcrumbs">
          <Typography variant="body2" color="textSecondary">
            Inicio /Actividad/Tour en el centroAmurallado /Confirmar reserva / Tus datos
          </Typography>
        </div>

        <h1 className="page-title">
          Detalles de tu reserva
        </h1>

        {/* MUI Stepper */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={1} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={index < 1}>
                <StepLabel 
                  StepIconProps={{
                    icon: index < 1 ? <CheckCircleIcon color="primary" /> : index + 1
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <div className="personal-data-content">
          <div className="form-container">
            <h2 className="form-title">
              Paso 2 de 3: Ingresa tus datos para continuar con la reserva.
            </h2>
            
            <h4 className="form-subtitle">
              ¡Estamos casi listos! Ingresa tus datos para confirmar tu reserva y recibir más detalles.
            </h4>

            <form className="personal-data-form">
              <div className="form-field">
                <label htmlFor="nombre">Nombre</label>
                <TextField
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Sara"
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="apellido">Apellido</label>
                <TextField
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Mendez"
                  error={!!errors.apellido}
                  helperText={errors.apellido}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  placeholder="saris@gmail.com"
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </div>

              <div className="form-field phone-field">
                <label htmlFor="telefono">Número de contacto</label>
                <div className="phone-input-container">
                  <TextField
                    className="country-code"
                    placeholder="+00"
                    variant="outlined"
                  />
                  <TextField
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    placeholder="0000000000"
                  />
                </div>
              </div>

              <div className="form-buttons">
                <ButtonBluePill 
                  text="Paso anterior: Elige tu actividad" 
                  className="button-yellow" 
                  onClick={handlePreviousStep} 
                />
                <ButtonBluePill 
                  text="Continuar con la reserva" 
                  className="button-blue" 
                  onClick={handleNextStep} 
                />
              </div>
            </form>
          </div>

          <div className="summary-container">
            <ActivityInfoCard activity={theActivity} />
            <ReservationDetailsCard bookingInfo={currentReservation} activity={theActivity} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Make sure to explicitly include the default export
export default PersonalDataFormPage;
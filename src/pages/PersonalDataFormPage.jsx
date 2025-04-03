import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";

const PersonalDataFormPage = () => {
  const { state } = useContextGlobal();
  const navigate = useNavigate();
  const { id } = useParams();
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
    navigate(`/actividad/${id || theActivity?.id}`);
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
  const prepareDataForNavigation = (data) => {
    // Copia profunda y segura
    const preparedData = JSON.parse(JSON.stringify(data));
    return preparedData;
  };
  const handleNextStep = (e) => {

    if (e) e.preventDefault();

    // Validar el formulario antes de continuar
    if (!validateForm()) {
      return;
    }
    
    // Verificar que tenemos datos válidos para pasar
    if (!currentReservation || !theActivity) {
      console.error("Faltan datos de reserva o actividad");
      alert("Error: No hay información de reserva disponible. Por favor, intenta nuevamente.");
      return;
    }
    
    // Preparar datos serializables para la navegación
    const safeFormData = prepareDataForNavigation(formData);
    const safeReservation = prepareDataForNavigation(currentReservation);
    const safeActivity = prepareDataForNavigation(theActivity);
    
    // Log para depuración
    console.log("Datos serializables para navegación:", { 
      formData: safeFormData,
      reservation: safeReservation,
      activity: safeActivity
    });
    
    // Almacenar los datos en sessionStorage como respaldo
    try {
      sessionStorage.setItem('formData', JSON.stringify(safeFormData));
      sessionStorage.setItem('currentReservation', JSON.stringify(safeReservation));
      sessionStorage.setItem('theActivity', JSON.stringify(safeActivity));
    } catch (error) {
      console.error("Error al guardar en sessionStorage:", error);
    }
    
    // Navegar a la página de confirmación
    navigate(`/actividad/${id || theActivity.id}/confirmarReserva/confirmar`, { 
      state: { 
        formData: safeFormData,
        reservation: safeReservation,
        activity: safeActivity
      }
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
        <BasicBreadcrumbs />

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
                  type="button"
                />
                <ButtonBluePill 
                  text="Continuar con la reserva" 
                  className="button-blue" 
                  onClick={handleNextStep} 
                  type="button"
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
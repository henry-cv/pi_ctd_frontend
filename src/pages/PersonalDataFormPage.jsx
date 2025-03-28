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

  // Efectos
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: ""
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
  };

  const handlePreviousStep = () => {
    navigate(`/actividad/${theActivity.id}`);
  };

  const handleNextStep = () => {
    // Aquí podrías realizar validaciones del formulario si es necesario
    navigate("/confirmar-reserva"); // Suponiendo que esta sería la página de confirmación final
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

export default PersonalDataFormPage;
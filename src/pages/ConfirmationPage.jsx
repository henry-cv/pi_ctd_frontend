import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContextGlobal } from "../gContext/globalContext";
import NavDash from "../components/NavDash";
import ActivityInfoCard from "../components/ActivitySummaryCard";
import ReservationDetailsCard from "../components/ReservationDetailsCard";
import ButtonBluePill from "../components/ButtonBluePill";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import ReservationService from "../services/ReservationService";
import "../css/pages/ConfirmationPage.css";
import { sendReservationConfirmation } from "../services/emailService";
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";

const ConfirmationPage = () => {
  const { state: globalState } = useContextGlobal();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // State for keeping reservation data
  const [userData, setUserData] = useState(null);
  const [theActivity, setTheActivity] = useState(null);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Stepper steps
  const steps = ['Tu actividad elegida', 'Tus datos', 'Confirmación'];

  // States for modal, loading, and notifications
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load data from location state and/or sessionStorage
  useEffect(() => {
    // Intentar obtener datos del estado de la ubicación primero
    const loadData = () => {
      try {
        setDataLoaded(false);
        
        // Intentar obtener datos del estado de la ruta primero
        const routeState = location.state || {};
        console.log("Estado de la ruta en ConfirmationPage:", routeState);
        
        let formData = routeState.formData;
        let reservation = routeState.reservation;
        let activity = routeState.activity;
        
        // Si falta algún dato del estado de la ruta, intentar obtenerlo de sessionStorage
        if (!formData || !reservation || !activity) {
          console.log("Datos incompletos en estado de ruta, intentando sessionStorage");
          
          try {
            if (!formData) {
              const storedFormData = sessionStorage.getItem('formData');
              if (storedFormData) {
                formData = JSON.parse(storedFormData);
                console.log("Datos de formulario cargados de sessionStorage");
              }
            }
            
            if (!reservation) {
              const storedReservation = sessionStorage.getItem('currentReservation');
              if (storedReservation) {
                reservation = JSON.parse(storedReservation);
                console.log("Datos de reserva cargados de sessionStorage");
              }
            }
            
            if (!activity) {
              const storedActivity = sessionStorage.getItem('theActivity');
              if (storedActivity) {
                activity = JSON.parse(storedActivity);
                console.log("Datos de actividad cargados de sessionStorage");
              }
            }
          } catch (error) {
            console.error("Error al cargar datos de sessionStorage:", error);
          }
        }
        
        // Si aún falta algún dato, intentar obtenerlo del contexto global
        if (!formData) formData = globalState.user;
        if (!reservation && globalState.reservation?.length > 0) {
          reservation = globalState.reservation[globalState.reservation.length - 1];
        }
        if (!activity) activity = globalState.activity?.theActivity;
        
        // Actualizar el estado con los datos obtenidos
        setUserData(formData);
        setCurrentReservation(reservation);
        setTheActivity(activity);
        
        // Marcar como datos cargados
        setDataLoaded(true);
        
        console.log("Estado final después de cargar datos:", { formData, reservation, activity });
      } catch (error) {
        console.error("Error al cargar datos en ConfirmationPage:", error);
        setDataLoaded(true); // Marcar como cargado para evitar un loop infinito
      }
    };
    
    loadData();
  }, [location.state, globalState]);

  // Check if we have all necessary data
  if (dataLoaded && (!theActivity || !currentReservation)) {
    return (
      <div className={`confirmation-page ${globalState.theme ? "dark" : ""}`}>
        <NavDash variant="home" />
        <div className="confirmation-container">
          <Typography variant="h5" className="error-message">
            No hay información de reserva disponible.
          </Typography>
          <Typography variant="body1" style={{ marginTop: '10px', marginBottom: '20px' }}>
            Error: No se pudo cargar la información de la reserva. Por favor, intenta nuevamente.
          </Typography>
          <ButtonBluePill 
            text="Volver a datos personales" 
            className="button-blue" 
            onClick={() => navigate("/datos-personales")} 
            style={{ marginRight: '10px' }}
          />
          <ButtonBluePill 
            text="Volver al inicio" 
            className="button-yellow" 
            onClick={() => navigate("/")} 
          />
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading while data is being loaded
  if (!dataLoaded) {
    return (
      <div className={`confirmation-page ${globalState.theme ? "dark" : ""}`}>
        <NavDash variant="home" />
        <div className="confirmation-container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh'
        }}>
          <CircularProgress size={60} />
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Cargando información de reserva...
          </Typography>
        </div>
        <Footer />
      </div>
    );
  }

  // Event handlers
  const handlePreviousStep = () => {
    navigate(`/actividad/${id || theActivity?.id}/confirmarReserva/datos`, {
      state: {
        formData: userData,
        reservation: currentReservation,
        activity: theActivity
      }
    });
  };

  const handleCompleteReservation = async () => {
    if (!currentReservation || !theActivity || !userData) {
      setSnackbar({
        open: true,
        message: 'Información de reserva incompleta',
        severity: 'error'
      });
      return;
    }
  
    // Debug: Log the complete reservation structure
    console.log("Complete currentReservation object:", JSON.stringify(currentReservation, null, 2));
    
    // Obtener la fecha de la reserva
    const reservationDate = currentReservation.date 
      ? new Date(currentReservation.date).toISOString().split('T')[0] 
      : null;
  
    console.log("Reservation Date:", reservationDate);
  
    try {
      setIsLoading(true);
  
      // Fetch disponibilidades para el producto
      const disponibilidadesResponse = await fetch(`/api/disponibilidad/${theActivity.id}`);
      
      if (!disponibilidadesResponse.ok) {
        throw new Error("No se pudo obtener la disponibilidad del producto");
      }
  
      const disponibilidades = await disponibilidadesResponse.json();
  
      console.log("Available Disponibilidades:", disponibilidades);
  
      // Encontrar la disponibilidad que coincide con la fecha
      const matchingDisponibilidad = disponibilidades.find(disp => 
        disp.fechaEvento === reservationDate && disp.cuposDisponibles > 0
      );
  
      if (!matchingDisponibilidad) {
        throw new Error("No se encontró disponibilidad para la fecha seleccionada");
      }
  
      // Preparar datos de reserva
      const reservationData = {
        disponibilidadProductoId: matchingDisponibilidad.id,
        usuarioEmail: userData.email,
        cantidadPersonas: currentReservation.cantidadPersonas || 1
      };
  
      // Validaciones adicionales
      if (!reservationData.disponibilidadProductoId) {
        throw new Error("disponibilidadProductoId es requerido pero no se encontró");
      }
      
      if (!reservationData.usuarioEmail) {
        throw new Error("usuarioEmail es requerido pero no se encontró");
      }
      
      console.log("Sending reservation data:", reservationData);
      
      try {
        const response = await ReservationService.createReservation(reservationData);
        console.log("Backend API response:", response);
        const completeReservationData = {
          ...response,
          cantidadPersonas: reservationData.cantidadPersonas,
          totalPrice: currentReservation.totalPrice || (theActivity.valorTarifa * reservationData.cantidadPersonas),
          date: reservationDate
        };
        
        // Enviar email de confirmación de reserva
        try {
          const emailResult = await sendReservationConfirmation(
            completeReservationData,
            userData,
            theActivity
          );
          console.log("Resultado del envío de email de reserva:", emailResult);
        } catch (emailError) {
          console.error("Error al enviar email de confirmación de reserva:", emailError);
          // Continuamos con el flujo aunque falle el email
        }
        // Mostrar mensaje de éxito
        setSnackbar({
          open: true,
          message: '¡Reserva completada exitosamente!',
          severity: 'success'
        });
        
        // Almacenar datos de reserva exitosa
        sessionStorage.setItem('lastReservation', JSON.stringify(response));
        
        // Redirigir a página de éxito después de un breve retraso
        setTimeout(() => {
          navigate(`/actividad/${id || theActivity?.id}/confirmarReserva/exitosa`, { 
            state: { 
              reservationId: response.id,
              confirmationCode: response.codigoConfirmacion,
              reservationData: response,
              userEmail: userData.email
            },
            replace: true
          });
        }, 1500);
      } catch (error) {
        console.error("API Error Details:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("Error completing reservation:", error);
      
      let errorMessage = 'Error al completar la reserva. Por favor, intenta nuevamente.';
      
      // Extraer mensaje de error específico de la respuesta si está disponible
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.disponibilidadProductoId) {
          errorMessage = error.response.data.disponibilidadProductoId;
        }
      } else {
        // Si no hay respuesta del backend, usar el mensaje del error
        errorMessage = error.message || errorMessage;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      
      setIsLoading(false);
    }
  };

  const handleEditSelection = () => {
    setIsBookingModalOpen(true);
  };

  const handleEditData = () => {
    navigate(`/actividad/${id || theActivity?.id}/confirmarReserva/datos`, { 
      state: { 
        formData: userData,
        reservation: currentReservation,
        activity: theActivity
      } 
    });
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };

  // Get formatted date and time from reservation
  const formatDate = () => {
    if (currentReservation.fecha) {
      return currentReservation.fecha;
    }
    
    if (currentReservation.disponibilidadProductoSalidaDto?.fechaEvento) {
      return new Date(currentReservation.disponibilidadProductoSalidaDto.fechaEvento).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    
    // Default date formatting
    return "vie, 25 mar 2025";
  };
  
  const formatTime = () => {
    if (currentReservation.horario) {
      return currentReservation.horario;
    }
    
    if (theActivity?.horaInicio && theActivity?.horaFin) {
      return `${theActivity.horaInicio.slice(0,5)} - ${theActivity.horaFin.slice(0,5)}`;
    }
    
    // Default time formatting
    return "5:00 pm - 7:00 pm";
  };

  return (
    <div className={`confirmation-page ${globalState.theme ? "dark" : ""}`}>
      <NavDash variant="home" />
      
      <div className="confirmation-container">
      <BasicBreadcrumbs/>


        <h1 className="page-title">
          Detalles de tu reserva
        </h1>

        {/* MUI Stepper */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={2} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} completed={index < 2}>
                <StepLabel 
                  StepIconProps={{
                    icon: index < 2 ? <CheckCircleIcon color="primary" /> : index + 1
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <div className="confirmation-content">
          <div className="reservation-details">
            <h2 className="section-title">
              Paso 3 de 3: Confirmar tus datos y reservar
            </h2>
            
            <h4 className="section-subtitle">
              Último paso: Confirma y reserva
            </h4>

            <div className="reservation-summary">
              <h3 className="summary-title">Tu reserva</h3>
              
              <div className="reservation-date">
                <p className="date-text">{formatDate()}</p>
                <p className="time-text">{formatTime()}</p>
              </div>

              <div className="reservation-pricing">
                <div className="pricing-row">
                  <span className="pricing-label">
                    <i className="person-icon"></i> Tarifa :
                  </span>
                  <span className="pricing-value">Por persona</span>
                </div>
                <div className="pricing-row">
                  <span className="pricing-label">
                    <i className="ticket-icon"></i> Cupos :
                  </span>
                  <span className="pricing-value">{currentReservation.cantidadPersonas || 1}</span>
                </div>
              </div>

              <button 
                className="edit-button" 
                onClick={handleEditSelection}
              >
                Editar mi selección
              </button>

              <div className="reservation-divider"></div>

              <div className="reserved-by">
                <h3 className="summary-title">Ha reservado</h3>
                
                <div className="user-info">
                  <div className="info-row">
                    <span className="info-label">
                      <i className="user-icon"></i> Cliente :
                    </span>
                    <span className="info-value">{userData?.nombre || ""} {userData?.apellido || ""}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">
                      <i className="email-icon"></i> Email :
                    </span>
                    <span className="info-value">{userData?.email || ""}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">
                      <i className="phone-icon"></i> numero de contacto :
                    </span>
                    <span className="info-value">{userData?.telefono || ""}</span>
                  </div>
                </div>

                <button 
                  className="edit-button" 
                  onClick={handleEditData}
                >
                  Editar mis datos
                </button>
              </div>
            </div>

            <div className="confirmation-buttons">
              <ButtonBluePill 
                text="Paso anterior: Tus Datos" 
                className="button-yellow" 
                onClick={handlePreviousStep} 
              />
              <ButtonBluePill 
                text={isLoading ? "Procesando..." : "Completa la reserva"} 
                className="button-blue" 
                onClick={handleCompleteReservation}
                disabled={isLoading}
                icon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              />
            </div>
          </div>

          <div className="summary-container">
            <ActivityInfoCard activity={theActivity} />
            <ReservationDetailsCard bookingInfo={currentReservation} activity={theActivity} />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal 
          open={isBookingModalOpen} 
          onClose={handleCloseBookingModal}
          activity={theActivity}
          reservation={currentReservation}
        />
      )}

      <Footer />
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ConfirmationPage;
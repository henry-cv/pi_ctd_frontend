import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/components/Step3ConfirmBooking.css";
import ButtonGral from "../components/ButtonGral";
import DescargaApp from "../components/DescargaApp";
import { FaCalendar, FaMoneyBill, FaSearch } from 'react-icons/fa';

const ReservationSuccessPage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for reservation data
  const [reservationData, setReservationData] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Load data from location state or sessionStorage
  useEffect(() => {
    // Check if there's state passed from previous page
    const routeState = location.state || {};
    console.log("ReservationSuccessPage - route state:", routeState);
    
    let reservData = routeState.reservationData;
    let confCode = routeState.confirmationCode;
    let email = routeState.userEmail;
    
    // If not in route state, check sessionStorage
    if (!reservData || !confCode) {
      try {
        const storedReservation = sessionStorage.getItem('lastReservation');
        if (storedReservation) {
          const parsedReservation = JSON.parse(storedReservation);
          console.log("Loaded reservation from sessionStorage:", parsedReservation);
          
          if (!reservData) reservData = parsedReservation;
          if (!confCode) confCode = parsedReservation.codigoConfirmacion;
          if (!email && parsedReservation.usuarioSalidaDto) {
            email = parsedReservation.usuarioSalidaDto.email;
          }
        }
      } catch (error) {
        console.error("Error loading reservation from sessionStorage:", error);
      }
    }
    
    // If we got some data, set state
    if (reservData) {
      console.log("Setting reservation data:", reservData);
      setReservationData(reservData);
      
      // If the product data is nested differently, adjust it
      if (!reservData.disponibilidadProductoSalidaDto?.producto && reservData.disponibilidadProducto?.producto) {
        const enhancedReservData = {
          ...reservData,
          disponibilidadProductoSalidaDto: {
            ...reservData.disponibilidadProductoSalidaDto,
            producto: reservData.disponibilidadProducto.producto
          }
        };
        setReservationData(enhancedReservData);
      }
    }
    
    if (confCode) setConfirmationCode(confCode);
    if (email) setUserEmail(email);
    
    // If we have no data at all, redirect to home
    if (!reservData && !confCode) {
      console.error("No reservation data found, redirecting to home");
      // Add a small delay before redirect
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [location.state, navigate]);

  // Screen size monitoring
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize); 

    return () => window.removeEventListener("resize", handleResize); 
  }, []);
  
  // Handlers
  const handleViewReservations = () => {
    navigate("/perfil");
  };
  
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="container-step3">
      <div className="columns-step3">
        <section className="column-step3-right">
          <h2 className="column-step3-tittle">Tu reserva ha sido confirmada</h2>

          {isSmallScreen && (
            <div className="info-box">
              <h3>Número de la reserva</h3>
              <p>{confirmationCode || "Procesando..."}</p>
            </div>
          )}

          <p>La confirmación te llegará al correo <strong>{userEmail || "tu correo registrado"}</strong></p>
          <p>El pago se procesará automáticamente 48 horas antes de tu reserva. 
             Asegúrate de tener fondos disponibles para evitar inconvenientes.</p>

          <section className="reservation-card">
            <div className="tour-info-container">
              <img
                src={reservationData?.disponibilidadProductoSalidaDto?.producto?.imagenes?.[0]?.urlImagen || 
                     "https://i.pinimg.com/736x/fc/e2/99/fce299e293cb34d9e1f565b3639c6926.jpg"}
                alt={reservationData?.disponibilidadProductoSalidaDto?.producto?.nombre || "Tour centro amurallado"}
                className="tour-image"
              />
              <div className="tour-details-info">
                <div className="tour-info">
                  <h3>{reservationData?.disponibilidadProductoSalidaDto?.producto?.nombre || "Tour centro amurallado"}</h3>
                  <p><FaCalendar/> {reservationData?.disponibilidadProductoSalidaDto?.fechaEvento || "25 de marzo de 2026"}</p>
                  <p><FaMoneyBill/> Precio total: {reservationData?.disponibilidadProductoSalidaDto?.producto?.precio || "75"} USD</p>
                </div>
              </div>
            </div>

            <ButtonGral
              className="btn-info-tour"
              text={"Ver o actualizar datos"}
              color="blue"
              onClick={handleViewReservations}
            />
          </section>

          <section className="other-options">
            <h3>Aprovecha al máximo tu experiencia</h3>
            <p>
              Sigue explorando nuevos destinos y descubre más{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); handleBackToHome(); }}>experiencias increíbles</a>.
            </p>
            <p>
              Revisa todas tus <a href="#" onClick={(e) => { e.preventDefault(); handleViewReservations(); }}>reservas aquí</a> y mantén el control
              de tu itinerario.
            </p>
          </section>
        </section>

        {!isSmallScreen && (
          <section className="column-step3-left">
            <div className="info-box">
              <h3>Número de la reserva</h3>
              <p>{confirmationCode || "Procesando..."}</p>
            </div>
            <DescargaApp forceMobileStyle={true} />
          </section>
        )}
      </div>

      {isSmallScreen && <DescargaApp forceMobileStyle={false} positionOnOff={true}/>}
    </div>
  );
};

export default ReservationSuccessPage;
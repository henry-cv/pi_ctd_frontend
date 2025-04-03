import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/components/Step3ConfirmBooking.css";
import ButtonGral from "../components/ButtonGral";
import DescargaApp from "../components/DescargaApp";
import { FaCalendar, FaMoneyBill, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import NavDash from "../components/NavDash";
import { Typography } from "@mui/material";
import { useContextGlobal } from "../gContext/globalContext";
import Footer from "../components/Footer";
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";

const ReservationSuccessPage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state: globalState } = useContextGlobal();
  
  // State for reservation data
  const [reservationData, setReservationData] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Format date from ISO to readable format - with timezone fix
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    
    try {
      // Fix for timezone issue - ensure date is treated as local time
      // Split the date parts and create a local date to prevent timezone shifts
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // Create date using local time components (year, month-1, day)
        const date = new Date(
          parseInt(parts[0]), 
          parseInt(parts[1]) - 1, // Month is 0-based in JavaScript
          parseInt(parts[2])
        );
        
        return date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // Fallback to regular parsing if format isn't as expected
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  // Load data from location state or sessionStorage
  useEffect(() => {
    setIsLoading(true);
    
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
    }
    
    if (confCode) setConfirmationCode(confCode);
    if (email) setUserEmail(email || globalState.user?.email);
    
    // If we have no data at all, redirect to home
    if (!reservData && !confCode) {
      console.error("No reservation data found, redirecting to home");
      // Add a small delay before redirect
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    
    setIsLoading(false);
  }, [location.state, navigate, globalState.user]);

  // Screen size monitoring
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
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
  
  // Extract product data based on the available structure
  const getProductData = () => {
    if (!reservationData) return {
      name: "Actividad",
      image: "https://i.pinimg.com/736x/fc/e2/99/fce299e293cb34d9e1f565b3639c6926.jpg",
      date: "Fecha no disponible",
      price: "0"
    };
    
    // Try different possible paths to get product data
    const producto = 
      (reservationData.disponibilidadProductoSalidaDto?.producto) || 
      (reservationData.disponibilidadProductoSalidaDto?.productoId && globalState.activity?.theActivity) ||
      {};
    
    const imagePath = 
      producto.productoImagenesSalidaDto?.[0]?.rutaImagen || 
      producto.imagenes?.[0]?.urlImagen ||
      "https://i.pinimg.com/736x/fc/e2/99/fce299e293cb34d9e1f565b3639c6926.jpg";
    
    const dateInfo = formatDate(reservationData.disponibilidadProductoSalidaDto?.fechaEvento);
    
    const priceValue = 
      producto.valorTarifa || 
      producto.precio || 
      "75";
    
    return {
      name: producto.nombre || "Tour centro amurallado",
      image: imagePath,
      date: dateInfo,
      price: priceValue
    };
  };
  
  // Get product data
  const productData = getProductData();

  if (isLoading) {
    return (
      <div className={`success-page-container ${globalState.theme ? "dark" : ""}`}>
        <NavDash variant="home" />
        <div className="container-step3" style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="loading-spinner"></div>
          <p>Cargando información de tu reserva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`success-page-container ${globalState.theme ? "dark" : ""}`}>
      <NavDash variant="home" />
      
      <div className="container-step3">
        <BasicBreadcrumbs />
        
        <div className="columns-setp3">
          <section className="column-step3-right">
            <h2 className="column-step3-tittle">¡Tu reserva ha sido confirmada!</h2>

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
                  src={productData.image}
                  alt={productData.name}
                  className="tour-image"
                  onError={(e) => {
                    e.target.src = "https://i.pinimg.com/736x/fc/e2/99/fce299e293cb34d9e1f565b3639c6926.jpg";
                  }}
                />
                <div className="tour-details-info">
                  <div className="tour-info">
                    <h3>{productData.name}</h3>
                    <p><FaCalendar/> Fecha: {productData.date}</p>
                    <p><FaMoneyBill/> Precio total: {productData.price} USD</p>
                  </div>
                </div>
              </div>

              <ButtonGral
                className="btn-info-tour"
                text={"Ver mis reservas"}
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
      
      <Footer />
    </div>
  );
};

export default ReservationSuccessPage;
// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { useContextGlobal } from "../gContext/globalContext";
import "../css/pages/BookingsDetail.css"; 
import { FaCalendar, FaCalendarAlt, FaCheck, FaEdit, FaTags } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaTicket } from "react-icons/fa6";
import ButtonGral from "../components/ButtonGral";
import { calcularPrecio, onlyFetchBooking, calcularCupos, formatFecha} from "../constants/data/funtionFetchBookings";
import WhatsAppSVG from "../components/MyBookings/WhatsAppSVG";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BookingDetail = () => {
    const { id } = useParams(); 
    console.log("ID de la reserva:", id);
  const { state, dispatch} = useContextGlobal();
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [cupos, setCupos] = useState(0);
  const [date, setDate] = useState(0);
  const navigate = useNavigate();



  
  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);
        const reservations = await onlyFetchBooking(id, state.token);
        setBooking(reservations);

        if (reservations.bookingData && reservations.productData) {
          const { cantidadPersonas } = reservations.bookingData;
          const { tipoTarifa, valorTarifa } = reservations.productData;

          setPrecioFinal(calcularPrecio(cantidadPersonas, tipoTarifa, valorTarifa));
          setCupos(calcularCupos(cantidadPersonas, tipoTarifa));
          setDate( formatFecha(reservations.bookingData.disponibilidadProductoSalidaDto.fechaEvento));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, [id, state.token]);

      

    if (loading) {
        return (
            <div className="user-favorites-loading">
                <div className="spinner"></div>
                <p>Cargando la información de tu reserva...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-favorites-error">
                <p>Error al cargar Reservas: {error}</p>
                <button onClick={() => window.location.reload()}>Intentar nuevamente</button>
            </div>
        );
    }
    console.log("Reserva:", booking);
  

    const handleCancelBooking = () => {
 Swal.fire({
       title: "¿Deseas eliminar esta Reserva?",
       text: "Esta acción no se puede deshacer y te cobraran segun la politica de pago y cancelación.",
       icon: "warning",
       showCancelButton: true,
       confirmButtonText: "Sí, eliminar",
       cancelButtonText: "Cancelar",
       customClass: {
         popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
         confirmButton: "custom-button", 
         cancelButton: "swal2-cancel", 
       }
     }).then((result) => {
      if (result.isConfirmed) {
        dispatch({
          type: "SET_ACTIVE_TAB_FILTER",
          payload: { activeTab: "reservations", selectedFilters: "cancel" },
        });
        navigate("/perfil"); 
      }
    });
  };
  

return (
    <div className="bookingDetail-container">
      <p className="bookingDetail-status">Reserva Confirmada</p>
      <h3 className="bookingDetail-title">Tu reserva en {booking.productData.nombre}.</h3>
      <div className="bookingDetail-content">
        <img
          src={booking.productData.productoImagenesSalidaDto?.[0]?.rutaImagen}
          alt="Centro amurallado"
          className="bookingDetail-image"
        />
        <div className="bookingDetail-details">
            <div>
            <div className="bookingDetail-tittle-button">
            <h4>Datos de la reservación</h4>
            <ButtonGral text="Modificar" color="blue" icon={<FaEdit />}  />
            </div>
          <p><FaTags/><span>Precio total:</span> <strong >{precioFinal} Usd</strong></p>
          <p><FaCalendarAlt/><strong>Fecha:</strong> {date}</p>
          <p><FaTicket/> <strong>Cupos:</strong> 1</p>
          <p> esta actividad es  {booking.productData.tipoTarifa.toLowerCase().replace(/_/g, " ")} osea que tu cupo es valido para que entren {booking.bookingData.cantidadPersonas} personas</p>

            </div>


          <div className="bookingDetail-info-contact">
          <p><FaCheck/> La confirmación va de camino a <strong className="email">{state.user.email}</strong></p>
          <p><FaCheck/> Alojamiento o servicio garantizado.</p>
          <ButtonGral text="Escríbele al anfitrión" color="blue"   icon={ <WhatsAppSVG/> } />
          </div>

        </div>

      </div>
      <div className="confirmation-code">
      <strong>Código de confirmación:</strong>
        <p> HT1POSD10933D</p>
      </div>
      <div className="cancellation-policy">
        <p><span className="free-cancel">Cancelación gratis</span> hasta 24 horas antes de la experiencia (hora local).</p>
        <ButtonGral text="Cancelar reserva" color="blue" otherClass="cancel-btn" onClick={handleCancelBooking} />
      </div>
    </div>
  );
};  

export default BookingDetail;
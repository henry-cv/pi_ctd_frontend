// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { useContextGlobal } from "../gContext/globalContext";
import "../css/pages/BookingsDetail.css";
import { FaCalendarAlt, FaCheck, FaCopy, FaEdit, FaTags } from "react-icons/fa";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaTicket } from "react-icons/fa6";
import ButtonGral from "../components/ButtonGral";
import { calcularPrecio, onlyFetchBooking, calcularCupos, formatFecha, handleGoWhatsApp } from "../constants/data/funtionFetchBookings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  WhatsappIcon,
} from "react-share";
import {
  paymentPolicies,
  cancellationPolicies,
} from "../constants/data/policiesDataInfo";
import { Tooltip } from 'react-tooltip';
import { Breadcrumbs } from "@mui/material";
import BasicBreadcrumbs from "../components/BasicBreadcrumbs";
import BookingModal from "../components/BookingModal";


const BookingDetail = () => {
  const { id } = useParams();
  console.log("ID de la reserva:", id);
  const { state, dispatch } = useContextGlobal();
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [cupos, setCupos] = useState(0);
  const [date, setDate] = useState(0);
  const navigate = useNavigate();
  const [politics, setPolitics] = useState([]);
  const [copied, setCopied] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // console.log(id, "id reserva");
  // console.log("las tab filter es :", state.userFiltersTabs.selectedFilters);

  const handleCloseModalBooking = () => {
    setOpenBooking(false);
  };

  const handleOpenModalBooking = () => {
    setIsBooking(true)
    setOpenBooking(true);

  };
  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);
        const reservations = await onlyFetchBooking(id, state.token);
        setBooking(reservations);

        const theActivity = { ...reservations.bookingData, ...reservations.disponibilityData, ...reservations.productData };

        // console.log("lo que le mandaresmo a la actividad ", theActivity);

        dispatch({
          type: "SET_ACTIVITY",
          payload: { theActivity },
        });

        
        if (reservations.bookingData && reservations.productData) {
          const { cantidadPersonas } = reservations.bookingData;
          const { tipoTarifa, valorTarifa } = reservations.productData;

          setPrecioFinal(calcularPrecio(cantidadPersonas, tipoTarifa, valorTarifa));
          setCupos(calcularCupos(cantidadPersonas, tipoTarifa));
          setDate(formatFecha(reservations.bookingData.disponibilidadProductoSalidaDto.fechaEvento));
          setPolitics({ cancelation: reservations.productData.politicaCancelacion, payment: reservations.productData.politicaPagos });
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
      <div className="user-booking-loading">
        <div className="spinner"></div>
        <p>Cargando la información de tu reserva...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-booking-loading">
        <p>Error al cargar Reservas: {error}</p>
        <button onClick={() => window.location.reload()}>Intentar nuevamente</button>
      </div>
    );
  }
  console.log("Reserva:", booking);

  const handleCancelBooking = async () => {
    Swal.fire({
      title: "¿Deseas Cancelar esta Reserva?",
      text: " Esta acción es irreversible. Es posible que se apliquen cargos según nuestra política de cancelación y reembolso. Por favor, revisa los términos antes de continuar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver atrás",
      customClass: {
        popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
        confirmButton: "custom-button",
        cancelButton: "swal2-cancel",
      }
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          const response = await fetch(`/api/reserva/cancelar/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${state.token}`
            }
          });
          console.log(response);



          if (!response.ok) throw new Error("Error al cancelar la reserva");

          dispatch({
            type: "SET_ACTIVE_TAB_FILTER",
            payload: { activeTab: "reservations", selectedFilters: "cancel" },
          });

          navigate("/perfil");
        } catch (error) {
          console.log(error);

          console.error("Error:", error);
        }
      }
    });
  };

  const handleCopyLink = (confirmationCode) => {
    navigator.clipboard.writeText(confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <section className="myBooking-Container">

      <div className="bookingDetail-container">
        <BasicBreadcrumbs />
        <p className="bookingDetail-status">Reserva  {booking.bookingData.estado.toLowerCase()}</p>
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
                <ButtonGral text="Modificar" color="blue" icon={<FaEdit />}
                  onClick={() => handleOpenModalBooking()} />
                <BookingModal
                  open={openBooking}
                  handleClose={handleCloseModalBooking}
                  activityId={booking.productData.id}
                  isBooking={isBooking}
                  setIsBooking ={setIsBooking}
                />
              </div>
              <p><FaTags /><span>Precio total:</span> <strong >{precioFinal} Usd</strong></p>
              <p><FaCalendarAlt /><strong>Fecha:</strong> {date}</p>
              <p><FaTicket /> <strong>Cupos:</strong> {booking.bookingData.cantidadPersonas} </p>
              <p className="info-slots"> Esta actividad es 
                {booking.productData.tipoTarifa === "POR_PERSONA" ?" por": " para"}
                <strong>
              { booking.productData.tipoTarifa.toLowerCase().replace(/_/g, " ").replace(/\bpor\b\s?/g, "") }
              {cupos > 1  ? "s":""}
              </strong> Tu reserva incluye la entrada para 
              <strong>{booking.bookingData.cantidadPersonas}</strong>persona{cupos > 1  ? "s":""} , es decir, 
                <strong>{cupos}</strong>
                { booking.productData.tipoTarifa.toLowerCase().replace(/_/g, " ").replace(/\bpor\b\s?/g, "") }
                {cupos > 1  ? "s":""}.</p>

            </div>


            <div className="bookingDetail-info-contact">
              <p><FaCheck /> La confirmación va de camino a <strong className="email">{state.user.email}</strong></p>
              <p><FaCheck /> Alojamiento o servicio garantizado.</p>
              <ButtonGral
                text="Escríbele al organizador"
                color="blue" icon={<WhatsappIcon
                  size={32}
                  round bgStyle={{ fill: "#25D366" }}
                  iconFillColor="#000000" />}
                onClick={() => handleGoWhatsApp(3005223014)}
              />
            </div>

          </div>

        </div>
        <div className="confirmation-code">
          <strong>Código de confirmación:</strong>
          <p > <FaCopy data-tooltip-id="tooltip"


            onClick={() => handleCopyLink(booking.bookingData.codigoConfirmacion)} className="copy-code"
          />  <span > {booking.bookingData.codigoConfirmacion}</span>
            <Tooltip id="tooltip" content={copied ? "Código copiado" : "Copiar código"} place="top" className="custom-tooltip-booking" />
          </p>

        </div>
        <div className="cancellation-policy">

          {cancellationPolicies.map(
            (policy) =>
              policy.id === politics.cancelation && (
                <p>
                  <strong
                    key={policy.id}
                    value={policy.id}
                  // onClick={() =>
                  //   handlePolicyClick(policyMapping[politics.cancelation])
                  // }
                  >
                    {policy.selectText}
                  </strong>
                  {policy.infoCard}
                </p>
              )
          )}

          {paymentPolicies.map(
            (policy) =>
              policy.id === politics.payment && (

                <>
                  <p>
                    <strong
                      key={policy.id}
                      value={policy.id}
                    // onClick={() =>
                    //   handlePolicyClick(policyMapping[politics.cancelation])
                    // }
                    >
                      {policy.selectText}
                    </strong>
                    {policy.infoBooking}
                  </p>

                  <p>
                    {politics.cancelation === "NO_REEMBOLSABLE" ? policy.bookingNoRefound : policy.bookingRefound}
                  </p>

                </>

              )
          )}
          <ButtonGral text="Cancelar reserva" color="blue" otherClass=" cancel-btn" onClick={handleCancelBooking} disabled={booking.bookingData.estado === "CANCELADA" || booking.bookingData.estado === "FINALIZADA" ? true : false} />
        </div>
      </div>

    </section>

  );
};

export default BookingDetail;
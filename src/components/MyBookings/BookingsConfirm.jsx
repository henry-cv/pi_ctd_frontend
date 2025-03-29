import { useState, useEffect } from "react";
import { useContextGlobal } from "../../gContext/globalContext";
import "../../css/components/UserBookings.css";
import { calcularPrecio, fetchBookings } from "../../constants/data/funtionFetchBookings";
import ActivityCard from "../ActivityCard";
import ButtonGral from "../ButtonGral";
import { useNavigate } from "react-router-dom";
import "../../css/pages/BookingsDetail.css";

const BookingsConfirm = () => {
  const { state,dispatch } = useContextGlobal();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  let tipoReserva = "";
  switch (state.userFiltersTabs.selectedFilters) {
    case "confirm":
      tipoReserva = "confirmadas";
      break;
    case "cancel":
      tipoReserva = "canceladas";
      break;
    case "complete":
      tipoReserva = "finalizadas";
      break;
    default:
      tipoReserva = "disponibles";
  }



  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);
        const reservations = await fetchBookings(state.user, state.token);
        setBookings(reservations);
        console.log("effect", reservations);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, [state.token]);

  if (loading) {
    return (
      <div className="user-booking-loading">
        <div className="spinner"></div>
        <p>Cargando Reservas {tipoReserva}...</p>
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
  const handleGoHome = () => {
    dispatch({
      type: "SET_ACTIVE_TAB_FILTER",
      payload: { activeTab: "edit-profile" },
    });

    navigate("/");

  }
  


  // console.log("el booking esta vacios ?",bookings.bookingData.estado === "FINALIZADA");


  const FilterData = () => {
    return bookings
      .filter((booking) => {
        if (state.userFiltersTabs.selectedFilters === "confirm") {
          return booking.bookingData.estado === "CONFIRMADA";
        } else if (state.userFiltersTabs.selectedFilters === "cancel") {
          return booking.bookingData.estado === "CANCELADA";
        }
        else if (state.userFiltersTabs.selectedFilters === "complete")
          return booking.bookingData.estado === "FINALIZADA";
      });
  }
  console.log("la filter data:");
  

  if (FilterData().length === 0) {

    return (
      <div className="user-favorites-empty">
        <h3>No tienes reservas {tipoReserva}</h3>
        <p>Explora nuestras actividades y reserva una para verla aquí.</p>
        <ButtonGral text="Explorar actividades" color="blue" onClick={handleGoHome}  />
      </div>
    );
  }
  
    
  return (
    <div className="user-bookings-container">
      <div className="user-booking-grid">
        {FilterData().map((booking) => {
            const { cantidadPersonas } = booking.bookingData;
            const { tipoTarifa, valorTarifa } = booking.productData;
            const precioFinal = calcularPrecio(cantidadPersonas, tipoTarifa, valorTarifa);

            return (
              <ActivityCard
                key={booking.bookingData.id}
                id={booking.bookingData.id}
                image={booking.productData.productoImagenesSalidaDto?.[0]?.rutaImagen}
                title={booking.productData.nombre}
                price={precioFinal}
                categories={booking.productData.categorias}
                fechaReserva={booking.bookingData.disponibilidadProductoSalidaDto.fechaEvento}
                estado={booking.bookingData.estado.toLowerCase()}
              />
            );
          })}
      </div>
    </div>
  );

}

export default BookingsConfirm;

import { useState, useEffect } from "react";
import { useContextGlobal } from "../../gContext/globalContext";
import "../../css/components/UserBookings.css";
import { calcularPrecio, fetchBookings } from "../../constants/data/funtionFetchBookings";
import ActivityCard from "../ActivityCard";
import ButtonGral from "../ButtonGral";
import { useNavigate } from "react-router-dom";
import "../../css/pages/BookingsDetail.css";
import "../../css/pages/dashboard.css";
import BasicPagination from "../BasicPagination";
import BookingFilterButtons from "./BookingFilterButtons";
import {useMediaQuery,} from "@mui/material";
import { formatFecha } from "../../constants/data/funtionFetchBookings";

const BookingsConfirm = () => {
  const { state, dispatch } = useContextGlobal();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isTablet = useMediaQuery(() => "(max-width: 1024px)");
  const isMobile = useMediaQuery(() => "(max-width: 480px)");

  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = isTablet ? 4 : isMobile ? 3 : 6;

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

  // Función para ir a Home
  const handleGoHome = () => {
    dispatch({
      type: "SET_ACTIVE_TAB_FILTER",
      payload: { activeTab: "edit-profile" },
    });
    navigate("/");
  };

  // Fetch bookings
  useEffect(() => {
    const getBookings = async () => {
      try {
        setLoading(true);
        const reservations = await fetchBookings(state.user, state.token);
        setBookings(reservations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, [state.token, state.user]);

  // Filter bookings based on status
  useEffect(() => {
    if (bookings.length > 0) {
      const initialFiltered = bookings.filter((booking) => {
        switch (state.userFiltersTabs.selectedFilters) {
          case "confirm":
            return booking.bookingData.estado === "CONFIRMADA";
          case "cancel":
            return booking.bookingData.estado === "CANCELADA";
          case "complete":
            return booking.bookingData.estado === "FINALIZADA";
          default:
            return true; 
        }
      });
      
      setFilteredBookings(initialFiltered);
      // Reset to first page when filter changes
      setCurrentPage(1);
    }
  }, [bookings, state.userFiltersTabs.selectedFilters]);

  // Calculate pagination data
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  // Render loading state
  if (loading) {
    return (
      <div className="user-booking-loading">
        <div className="spinner"></div>
        <p>Cargando Reservas {tipoReserva}...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="user-booking-loading">
        <p>Error al cargar Reservas: {error}</p>
        <button onClick={() => window.location.reload()}>Intentar nuevamente</button>
      </div>
    );
  }

  // Render empty state
  if (filteredBookings.length === 0) {
    return (
      <div className="user-favorites-empty">
        <h3>No tienes reservas {tipoReserva}</h3>
        <p>Explora nuestras actividades y reserva una para verla aquí.</p>
        <ButtonGral text="Explorar actividades" color="blue" onClick={handleGoHome} />
      </div>
    );
  }

  // Render bookings
  return (
    <div className="user-bookings-container">
      <div className="filter-controls-container" style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <BookingFilterButtons 
          bookings={bookings} 
          setFilteredBookings={setFilteredBookings}
          originalFilter={state.userFiltersTabs.selectedFilters}
        />
      </div>
      
      <div className="user-booking-grid">
        {currentBookings.map((booking) => {
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
              fechaReserva={formatFecha(booking.bookingData.disponibilidadProductoSalidaDto.fechaEvento)}
              estado={booking.bookingData.estado.toLowerCase()}
            />
          );
        })}
      </div>
      <div className="pagination_dash">
        <BasicPagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default BookingsConfirm;
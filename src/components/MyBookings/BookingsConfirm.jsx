import { useState, useEffect } from "react";
import { useContextGlobal } from "../../gContext/globalContext";
import "../../css/components/UserBookings.css";
import { calcularPrecio, fetchBookings } from "../../constants/data/funtionFetchBookings";
import ActivityCard from "../ActivityCard";

const BookingsConfirm = () => {
    const { state } = useContextGlobal();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, [state.token]);

    if (loading) {
        return (
            <div className="user-favorites-loading">
                <div className="spinner"></div>
                <p>Cargando Reservas Confirmadas...</p>
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

    if (bookings.length === 0) {
        return (
            <div className="user-favorites-empty">
                <h3>No tienes reservas</h3>
                <p>Explora nuestras actividades y reserva una para verla aquí.</p>
                <a href="/" className="explore-link">Explorar actividades</a>
            </div>
        );
    }

    return (
        <div className="user-bookings-container">
            <div className="user-booking-grid">
                {bookings.map((booking) => {
                    // Extraer datos del objeto booking
                    const { cantidadPersonas } = booking.bookingData;
                    const { tipoTarifa, valorTarifa } = booking.productData;
                    const precioFinal = calcularPrecio(cantidadPersonas, tipoTarifa, valorTarifa);

                    return (
                        <ActivityCard
                            key={booking.productData.id}
                            id={booking.bookingData.id}
                            image={booking.productData.productoImagenesSalidaDto?.[0]?.rutaImagen}
                            title={booking.productData.nombre}
                            price={precioFinal} // Asegurar que use el precio calculado
                            categories={booking.productData.categorias}
                            fechaReserva={booking.bookingData.disponibilidadProductoSalidaDto.fechaEvento}
                        />
                    );
                })}

            </div>
        </div>
    );
}

export default BookingsConfirm;

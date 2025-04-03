import { useState, useEffect } from "react";
import "../../css/components/UserBookings.css";

const BookingFilterButtons = ({ bookings, setFilteredBookings, originalFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Ordenar por:");

  const filters = [
    { id: "fecha-asc", label: "Fecha: próximas primero" },
    { id: "fecha-desc", label: "Fecha: ultimas primero" },
    { id: "nombre-asc", label: "Nombre: A-Z" },
    { id: "nombre-desc", label: "Nombre: Z-A" }
  ];


  useEffect(() => {
    if (bookings.length > 0) {
      const filteredByStatus = filterByStatus(bookings, originalFilter);
      setFilteredBookings(filteredByStatus);
    }
  }, [bookings, originalFilter]);


  const filterByStatus = (bookingsArray, filter) => {
    return bookingsArray.filter((booking) => {
      switch (filter) {
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
  };


  const sortBookings = (filterType) => {

    let filteredBookings = filterByStatus(bookings, originalFilter);
    
 
    switch (filterType) {
      case "fecha-asc":
        filteredBookings.sort((a, b) => {
          const dateA = new Date(a.bookingData.disponibilidadProductoSalidaDto.fechaEvento);
          const dateB = new Date(b.bookingData.disponibilidadProductoSalidaDto.fechaEvento);
          return dateA - dateB;
        });
        break;
      case "fecha-desc":
        filteredBookings.sort((a, b) => {
          const dateA = new Date(a.bookingData.disponibilidadProductoSalidaDto.fechaEvento);
          const dateB = new Date(b.bookingData.disponibilidadProductoSalidaDto.fechaEvento);
          return dateB - dateA;
        });
        break;
      case "nombre-asc":
        filteredBookings.sort((a, b) => 
          a.productData.nombre.localeCompare(b.productData.nombre)
        );
        break;
      case "nombre-desc":
        filteredBookings.sort((a, b) => 
          b.productData.nombre.localeCompare(a.productData.nombre)
        );
        break;
      default:
        filteredBookings = bookings; 
        break;
    }
    
    return filteredBookings;
  };


  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter.label);
    setIsOpen(false);
    
    const sorted = sortBookings(filter.id);
    setFilteredBookings(sorted);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.booking-filter-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="booking-filter-dropdown">
      <button 
        className="dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedFilter}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className={`dropdown-option ${selectedFilter === filter.label ? 'active' : ''}`}
              onClick={() => handleFilterSelect(filter)}
              role="option"
              aria-selected={selectedFilter === filter.label}
            >
              {filter.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingFilterButtons;
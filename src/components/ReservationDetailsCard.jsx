import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useContextGlobal } from "../gContext/globalContext";
import ActivityPolitics from "./ActivityPolitics";
import BookingModal from "./BookingModal";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as IoIcons from "react-icons/io5";
import FlashlightOnIcon from "@mui/icons-material/FlashlightOn";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SchoolIcon from "@mui/icons-material/School";
import KayakingIcon from "@mui/icons-material/Kayaking";
import InsightsIcon from "@mui/icons-material/Insights";
import "../css/components/ReservationDetailsCard.css";

// Material UI icon mapping
const muiIcons = {
  FlashlightOnIcon,
  SelfImprovementIcon,
  SchoolIcon,
  KayakingIcon,
  InsightsIcon
};

const ReservationDetailsCard = ({ bookingInfo, activity }) => {
  const { state } = useContextGlobal();
  const [expanded, setExpanded] = useState(false);
  const [openBooking, setOpenBooking] = useState(false);

  // Get the correct icon component based on the icon name
  const getIconComponent = (iconName) => {
    if (!iconName) return FaIcons.FaStar;
    
    // Check for Font Awesome (FA) icons
    if (iconName.startsWith("Fa") && !iconName.startsWith("Fa6")) {
      return iconName in FaIcons ? FaIcons[iconName] : FaIcons.FaStar;
    }
    
    // Check for Font Awesome 6 (FA6) icons
    if (iconName.startsWith("Fa6") || (iconName.startsWith("Fa") && !(iconName in FaIcons))) {
      const fa6Name = iconName.startsWith("Fa6") ? iconName.substring(3) : iconName;
      return fa6Name in Fa6Icons ? Fa6Icons[fa6Name] : FaIcons.FaStar;
    }
    
    // Check for Ionicons (IO5) icons
    if (iconName.startsWith("Io")) {
      return iconName in IoIcons ? IoIcons[iconName] : FaIcons.FaStar;
    }
    
    // Check for Material UI icons
    if (iconName.endsWith("Icon")) {
      return iconName in muiIcons ? muiIcons[iconName] : FaIcons.FaStar;
    }
    
    // Default to FaStar if no match found
    return FaIcons.FaStar;
  };

  // Formatear la fecha de reserva
  const bookingDate = bookingInfo?.date ? new Date(bookingInfo.date) : new Date();
  const formattedDate = format(bookingDate, "EEE, dd MMM yyyy", { locale: es });
  
  // Obtener la hora de inicio y fin formateada
  const formatTime = (timeString) => timeString ? timeString.substring(0, 5) : "00:00";
  const startTime = formatTime(activity?.horaInicio);
  const endTime = formatTime(activity?.horaFin);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpenModalBooking = () => {
    setOpenBooking(true);
  };

  const handleCloseModalBooking = () => {
    setOpenBooking(false);
  };

  return (
    <div className={`reservation-summary-card ${state.theme ? "dark" : ""}`}>
      <div className="reservation-summary-content">
        <h2 className="card-title"> Los datos de tu reserva </h2>
        
        <div className="reservation-date">
          <p className="date-value">{formattedDate}</p>
          <p className="time-value">{startTime}pm - {endTime}pm</p>
        </div>
        
        <div className="reservation-info-row tarifa">
          <i className="fa-solid fa-users"></i>
          <p className="info-label">Tarifa </p>
          <p className="info-value">: Por persona </p>
        </div>
        
        <div className="reservation-info-row cupos">
          <i className="fa-solid fa-ticket"></i>
          <p className="info-label">Cupos </p>
          <p className="info-value">: {bookingInfo?.slot || 1}</p>
        </div>
        
        <div className="reservation-calculation">
          <p className="calculation-row">
            <span>1 cupo</span>
            <span>x</span>
            <span>${activity?.valorTarifa || 75} USD</span>
          </p>
        </div>
        
        <div className="reservation-edit-link">
          <p className="edit-selection-text">
            <a href="#" className="edit-selection-link" onClick={(e) => {
              e.preventDefault();
              handleOpenModalBooking();
            }}>Editar mi selección</a>
          </p>
        </div>
        
        <div className="reservation-expand" onClick={handleExpandClick}>
          <p className="expand-text">
            {expanded ? "ocultar" : "ver más"}
          </p>
          <IconButton
            className="expand-button"
            aria-expanded={expanded}
            aria-label="mostrar más"
            size="small"
          >
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
          </IconButton>
        </div>
        
        {expanded && (
          <div className="reservation-additional-info">
            {activity && <ActivityPolitics 
              cancelation={activity.politicaCancelacion} 
              payment={activity.politicaPagos} 
            />}
            
            {activity?.caracteristicas?.map((caracteristica) => {
              const IconComponent = getIconComponent(caracteristica.icono);
              return (
                <div key={caracteristica.id} className="amenity-item">
                  <IconComponent className="amenity-icon" />
                  <p>{caracteristica.nombre}</p>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="reservation-total">
          <p className="total-text">
            Total: ${bookingInfo?.totalPrice || 75} USD
          </p>
        </div>
      </div>

      {/* BookingModal */}
      <BookingModal
        open={openBooking}
        handleClose={handleCloseModalBooking}
        activityId={activity?.id}
      />
    </div>
  );
};

export default ReservationDetailsCard;
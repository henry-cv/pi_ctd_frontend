import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";
import BookingCalendar from "./BookingCalendar";
import { IoLocation, IoTicket } from "react-icons/io5";
import { FaCreditCard, FaHourglass } from "react-icons/fa";
import ButtonBluePill from "./ButtonBluePill";
import "../css/components/BookingModal.css";
import { useContextGlobal } from "../gContext/globalContext";
import BookingQuantity from "./BookingQuantity";
import Swal from "sweetalert2";
import ActivityPolitics from "./ActivityPolitics";
import { es } from "date-fns/locale";
import DurationInfo from "./DurationInfo";
import { funtionsBookingModal } from '../constants/data/funtionsModalBooking';
import { Calendar1Icon, CalendarCheck2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";


const BookingModal = ({ open, handleClose, activityId }) => {
  const [quantity, setQuantity] = useState(0);
  const [errorsBooking, setErrorsBooking] = useState({});
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [priceQuantity, setPriceQuantity] = useState(0);
  const { state, dispatch } = useContextGlobal(null);
  const { theActivity } = state.activity || {};

  // Extraer valores necesarios theActivity 
  const nombre = theActivity?.nombre || "";
  const horaInicio = theActivity?.horaInicio || "00:00:00";
  const tipoTarifa = theActivity?.tipoTarifa || "";
  const valorTarifa = theActivity?.valorTarifa || 0;
  const diasDisponible = theActivity?.diasDisponible || [];
  const horaFin = theActivity?.horaFin || "00:00:00";
  const ciudad = theActivity?.ciudad || "";
  const pais = theActivity?.pais || "";
  const id = theActivity?.id || "";
  const cuposDisponibles = theActivity?.['0']?.cuposDisponibles || 0;
  const cuposTotales = theActivity?.cuposTotales || 0;
  const tipoEvento = theActivity?.tipoEvento || "";
  const politicaCancelacion = theActivity?.politicaCancelacion || ""
  const politicaPagos = theActivity?.politicaPagos || ""
  const availabilityType = tipoEvento === "FECHA_UNICA" ? "fecha" : "dias";
  const getEventDates = () => {
    if (!theActivity) return [];
    return Object.keys(theActivity)
      .filter((key) => !isNaN(parseInt(key)))
      .map((key) => theActivity[key].fechaEvento);
  };
  const fechasEvento = getEventDates();
  const [cupoDisponible, setCupoDisponible] = useState(cuposDisponibles);
  const [openQuantity, setOpenQuantity] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);
  const [anchorElQuantity, setAnchorElQuantity] = useState(null);
  const [resetCalendar, setResetCalendar] = useState(false);
  const [showDate, setShowDate]=useState(false)

  // console.log(bookingDate);
  

  //funciones para abrir , cerrar, resetear
  const {
    validateCreateBooking,
    handleOpenCalendar,
    handleCloseCalendar,
    handleOpenBookingQuantity,
    handleCloseBookingQuantity,
    resetBookingData,
    handleCloseBookingModal,
    handleSelectDate,
    handleSelectQuantity,
  } = funtionsBookingModal({
    setBookingDate,
    setQuantity,
    setPriceQuantity,
    setErrorsBooking,
    setResetCalendar,
    handleClose,
    setAnchorEl,
    setAnchorElQuantity,
    setOpenQuantity,
    valorTarifa,
    errorsBooking,
    setShowDate,
  });
  
  //submit por ahora quedó aqui 
  const BookingSubmit = () => {
    if (validateCreateBooking( bookingDate, quantity)) {


      const reservationData = {
        idActivity: id,
        idUser: state.user.id,
        totalPrice: priceQuantity,
        slot: quantity,
        date: bookingDate,
        cuposReservados: quantity,
      };

      dispatch({
        type: "SET_RESERVATION",
        payload: reservationData,
      });

      Swal.fire({
        icon: "success",
        title: "Reserva exitosa",
        text: "reserva exitosa mira toda la información en tus reservas",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
        }
      });
      
      resetBookingData();
      handleClose();
    } else {

      Swal.fire({
        icon: "error",
        title: "Reserva fallida",
        text: "no se puede hacer la reserva",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
        }
      });

    }
  };


  return (
    <Dialog
      open={open}
      onClose={handleCloseBookingModal}
      maxWidth="sm"
      fullWidth
      sx={{ "& .MuiPaper-rounded": { borderRadius: isMobile ? "0" : "20px" } }}
      className={
        state.theme
          ? "card-modal-container card-dark-modal-container"
          : "card-modal-container card-ligth-modal-container"
      }
    >
      <DialogTitle className={state.theme ? "font-dark" : "font-ligth"}>
        {nombre}
        <IconButton
          aria-label="close"
          onClick={handleCloseBookingModal}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon className={state.theme ? "font-dark" : "font-ligth"} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Esta actividad se reserva por{" "}
          {tipoTarifa.toLowerCase().replace(/_/g, " ")}. Selecciona la fecha y
          cuántos cupos deseas.
        </Typography>

        <Box className="select-date-slot">
          <div className="date">
            <Box className="select-item">
              
              <IconButton onClick={handleOpenCalendar}>
                {/* <CalendarCheck2                  
                className={state.theme ? "font-dark" : "font-ligth"}
                /> */}
        <FontAwesomeIcon
          icon={faCalendarCheck}
          className={state.theme ? "font-dark" : "font-ligth"}
        />
                
              </IconButton>
              <Typography
                variant="body2"
                gap={1}
                sx={{ cursor: "pointer" }}
                onClick={handleOpenCalendar}
              >

{bookingDate
      ? format(bookingDate, "EEE, dd MMM", { locale: es })
      : "Selecciona tu fecha"
  }

              </Typography>
            </Box>
            {errorsBooking.date && (
              <span className="error-message">{errorsBooking.date}</span>
            )}
          </div>

          <div className="slot">
            <Box display="flex" alignItems="center" className="select-item">
              <IconButton onClick={handleOpenBookingQuantity}>
                <IoTicket
                  className={state.theme ? "font-dark" : "font-ligth"}
                />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={handleOpenBookingQuantity}
              >
                {quantity === 0
                  ? isMobile
                    ? "tu cupo"
                    : "Selecciona tus cupos"
                  : `${quantity} ${
                      quantity === 1
                        ? isMobile
                          ? "Cupo"
                          : "Cupo seleccionado"
                        : isMobile
                        ? "Cupos"
                        : "Cupos seleccionados"
                    }`}
              </Typography>
            </Box>
            {errorsBooking.slot && (
              <span className="error-message">{errorsBooking.slot}</span>
            )}
          </div>
        </Box>

        <BookingCalendar
          anchorEl={anchorEl}
          handleClose={handleCloseCalendar}
          dateRange={dateRange}
          setDateRange={setDateRange}
          availability={{
            type: availabilityType,
            data: availabilityType === "dias" ? diasDisponible : fechasEvento,
          }}
          setBookingDate={handleSelectDate}
          bookingDate={bookingDate}
          resetCalendar={resetCalendar}
          setResetCalendar={setResetCalendar}
          cupoDisponible ={cupoDisponible}
        />

        <BookingQuantity
          open={openQuantity}
          onClose={handleCloseBookingQuantity}
          quantity={quantity}
          setQuantity={handleSelectQuantity}
          cupoDisponible={cupoDisponible}
          tipoTarifa = {tipoTarifa}
        />

        {!bookingDate ? null : (
          <>
            {cupoDisponible === 3 ? (
              <span style={{ color: "#FD6905" }}>¡Solo quedan 3 cupos!</span>
            ) : cupoDisponible === 2 ? (
              <span style={{ color: "red" }}>¡Solo quedan 2 cupos!</span>
            ) : cupoDisponible === 1 ? (
              <span style={{ color: "red" }}>¡Último cupo disponible!</span>
            ) : cupoDisponible === 0 ? (
              <span style={{ color: "red" }}>¡No hay cupos disponibles!</span>
            ) : null}
          </>
        )}

        <ActivityPolitics  cancelation={politicaCancelacion} payment={politicaPagos} />

        <Box mt={3} p={2} border={1} borderRadius={2}>

          <div className="title-checkbox">
            <Typography fontWeight={600}>{nombre}</Typography>
          </div>

            {/* //cuposs aqui */}
            {cupoDisponible > 0 && (
            <Typography  className={!state.theme ? "font-blue" : "font-yellow"}>
              Cupos disponibles: {cupoDisponible}
            </Typography>
          )}

          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <IoLocation />
            <Typography>
              {ciudad},{pais}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mt={1} gap={1}>
                <FontAwesomeIcon
                     icon={faCalendarCheck}
                     className="info-icon"
                   />
            <Typography>
              Fecha Escogida: {bookingDate ? format(bookingDate, "EEE, dd MMM yyyy", { locale: es }) : "No seleccionada"}

            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <AccessTimeIcon />
            <Typography>
              Hora de inicio:
              {horaInicio.substring(0, 5)}
            </Typography>
          </Box>
          <Typography mt={2}>
            {tipoTarifa.toLowerCase().replace(/_/g, " ")} X {valorTarifa} USD
          </Typography>
          <Typography mt={2}>Total: ${priceQuantity} USD</Typography>
       
        </Box>
      </DialogContent>

      <DialogActions className="Booking-principal-container">
        <ButtonBluePill
          text="Reservar Ahora"
          className="button-blue btn-save"
          type="submit"
          onClick={BookingSubmit}
        />
      </DialogActions>

    </Dialog>
  );
};

export default BookingModal;

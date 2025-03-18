import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  Checkbox,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";
import BookingCalendar from "./BookingCalendar";
import { IoCalendarClear, IoCloudDoneSharp, IoLocation, IoTicket } from "react-icons/io5";
import { FaCreditCard, FaHourglass } from "react-icons/fa";
import ButtonBluePill from "./ButtonBluePill";
import "../css/components/BookingModal.css";
import { useContextGlobal } from "../gContext/globalContext";
import BookingQuantity from "./BookingQuantity";
import Swal from "sweetalert2";
import ActivityPolitics from "./ActivityPolitics";
import { es } from "date-fns/locale";
import BookingCalendarDays from "./BookingCalendarDays";
import BookingCalendarDate from "./BookingCalendarDate";
import { LocateIcon } from "lucide-react";

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
  
  const {
    theActivity,
  } = state.activity || {};
  
  // Extraer valores necesarios del objeto theActivity de manera segura
  const nombre = theActivity?.nombre || "";
  const horaInicio = theActivity?.horaInicio || "00:00:00";
  const tipoTarifa = theActivity?.tipoTarifa || "";
  const valorTarifa = theActivity?.valorTarifa || 0;
  const diasDisponible = theActivity?.diasDisponible || [];
  const horaFin = theActivity?.horaFin || "00:00:00";
  const ciudad = theActivity?.ciudad || "";
  const pais = theActivity?.pais || "";
  const id = theActivity?.id || "";
  const cuposTotales = theActivity?.cuposTotales || 0;
  const cuposReservados = theActivity?.cuposReservados || 0;
  const tipoEvento = theActivity?.tipoEvento || "";
  const availabilityType = tipoEvento === "FECHA_UNICA" ? "fecha" : "dias";
  const getEventDates = () => {
    if (!theActivity) return [];
    
    // Convertir de objeto a array
    return Object.keys(theActivity)
      .filter(key => !isNaN(parseInt(key)))
      .map(key => theActivity[key].fechaEvento);
  };

  const fechasEvento = getEventDates();
  
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  console.log("cupos totales", cuposTotales);
  
  const [cupoDisponible, setCupoDisponible] = useState(cuposTotales);
  const [cupoReservados, setCupoReservados] = useState(0);
  const [openQuantity, setOpenQuantity] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);
  const [anchorElQuantity, setAnchorElQuantity] = useState(null);
  const totalMinutes = parseTime(horaFin) - parseTime(horaInicio);
  const horas = Math.floor(totalMinutes / 60);
  const minutos = totalMinutes % 60;
  const duration = `${horas} horas y ${minutos} minutos`;
  const [isChecked, setIsChecked] = useState(false);
  const [resetCalendar, setResetCalendar] = useState(false);

  
  console.log(cupoDisponible ,"los sisponibless y los vendidos" ,cupoReservados);
  console.log(state.activity);
  
  
  const validateCreateBooking = () => {
    const newErrors = {};

    if (!bookingDate) {
      newErrors.date = "Escoger la fecha es requerida";
    }

    if (quantity === 0) {
      newErrors.slot = "La cantidad de reservas es requerido";
    }

    setErrorsBooking(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleOpenCalendar = (event) => setAnchorEl(event.currentTarget);
  
  const handleCloseCalendar = () => setAnchorEl(null);

  const handleOpenBookingQuantity = (event) => {
    setAnchorElQuantity(event.currentTarget);
    setOpenQuantity(true);
  };

  const handleCloseBookingQuantity = (newQuantity) => {
    if (typeof newQuantity === "number") {
      setPriceQuantity(newQuantity * valorTarifa);
    }
    setOpenQuantity(false);
    setAnchorElQuantity(null);
  };

  const resetBookingData = () => {
    setBookingDate(null);
    setQuantity(0);
    setIsChecked(false);
    setPriceQuantity(0);
  };

  const BookingSubmit = () => {

    if (validateCreateBooking()) {
      let cupoRestante = 0;
      if (theActivity && bookingDate) {
        const formattedDate = bookingDate.toISOString().split('T')[0];
        
        for (const key in theActivity) {
          if (!isNaN(parseInt(key)) && theActivity[key].fechaEvento === formattedDate) {
            cupoRestante = theActivity[key].cuposTotales - quantity;
            setCupoDisponible(cupoRestante)
            setCupoReservados(cupoReservados+quantity)
            break;
          }
        }
      }
  
  
      // const existingReservation = state.reservation?.find(
      //   (res) => res.idActivity === id && res.idUser === state.user.id
      // );
  
      // if (existingReservation) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Reserva existente",
      //     text: "ya hiciste una reserva para esta actividad mira toda la información en tus reservas",
      //     timer: 2000,
      //     showConfirmButton: false,
      //   });
      //   handleClose();
      //   resetBookingData();
      //   return;
      // }
  
  
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
      });
      
      resetBookingData();
      handleClose();
    } else {
      console.log("Validación fallida, no se puede hacer el check.");
    }

    
 
  };

  const handleCloseBookingModal = () => {
    resetBookingData();
    setErrorsBooking((prevErrors) => ({
      ...prevErrors,
      date: "",
      slot: ""
    }));
    setResetCalendar(true)
    handleClose();
  };

  const handleSelectDate = (date) => {
    setBookingDate(date);
    

    if (theActivity) {
      const formattedDate = date.toISOString().split('T')[0];
      
      for (const key in theActivity) {
        if (!isNaN(parseInt(key)) && theActivity[key].fechaEvento === formattedDate) {
          const cupoSelectDate = theActivity[key].cuposTotales - cupoDisponible;
          console.log(cupoDisponible,"disponiblesss");
          
          if (cupoDisponible === 0) {
            setCupoDisponible(theActivity[key].cuposTotales);
          } else {
            setCupoDisponible(cupoSelectDate); 
          }
          
          

          break;
        }
      }
    }
    
    if (errorsBooking.date) {
      setErrorsBooking((prevErrors) => ({
        ...prevErrors,
        date: "",
      }));
    }
  };

  const handleSelectQuantity = (newQuantity) => {
    setQuantity(newQuantity);
    if (errorsBooking.slot) {
      setErrorsBooking((prevErrors) => ({
        ...prevErrors,
        slot: "",
      }));
    }
    setOpenQuantity(false);
  };

  // Efecto para inicializar la fecha si es de tipo "fecha" única
  useEffect(() => {
    if (open && theActivity && availabilityType === "fecha" && fechasEvento.length > 0) {
      const fechaUnica = new Date(fechasEvento[0]);
      handleSelectDate(fechaUnica);
    }
  }, [open, theActivity, availabilityType]);

  return (
    <Dialog
      open={open}
      onClose={handleCloseBookingModal}
      maxWidth="sm"
      fullWidth
      sx={{ "& .MuiPaper-rounded": { borderRadius: isMobile ? "0" : "20px" } }}
      className={state.theme ? "card-modal-container card-dark-modal-container" : "card-modal-container card-ligth-modal-container"}
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
                <CalendarTodayIcon
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
                  : format(new Date(), "EEE, dd MMM", { locale: es })}
              </Typography>
            </Box>
            {errorsBooking.date && (
              <span className="error-message">{errorsBooking.date}</span>
            )}
          </div>

          <div className="slot">
            <Box display="flex" alignItems="center" className="select-item">
              <IconButton onClick={handleOpenBookingQuantity}>
                <IoTicket className={state.theme ? "font-dark" : "font-ligth"} />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={handleOpenBookingQuantity}
              >
                {quantity === 0
                  ? (isMobile ? "tu cupo" : "Selecciona tus cupos") 
                  : `${quantity} ${quantity === 1 
                      ? (isMobile ? "Cupo" : "Cupo seleccionado") 
                      : (isMobile ? "Cupos" : "Cupos seleccionados")}`}
              </Typography>
            </Box>
            {errorsBooking.slot && (
              <span className="error-message">{errorsBooking.slot}</span>
            )}
          </div>
        </Box>
{/* 
        <>{renderModal()}</> */}

        

        <BookingCalendar
          anchorEl={anchorEl}
          handleClose={handleCloseCalendar}
          dateRange={dateRange}
          setDateRange={setDateRange}
          availability={{
            type: availabilityType,
            data: availabilityType === "dias" 
              ? diasDisponible 
              : fechasEvento
          }}
          setBookingDate={handleSelectDate}
          bookingDate={bookingDate}
          resetCalendar ={resetCalendar}
          setResetCalendar ={setResetCalendar}
        />

        <BookingQuantity
          open={openQuantity}
          onClose={handleCloseBookingQuantity}
          quantity={quantity}
          setQuantity={handleSelectQuantity}
          cupoDisponible ={cupoDisponible}
        />

        {/* Mostrar alerta de pocos cupos si es necesario */}
        {cupoDisponible > 0 && cupoDisponible <= 3 && (
          <Typography color="error" mt={1}>
            ¡Últimas {cupoDisponible} reservas disponibles para esta fecha!
          </Typography>
        )}

        <ActivityPolitics />

        <Box
          mt={3}
          p={2}
          border={1}
          borderRadius={2}
        >
          


          <div className="title-checkbox">
            <Typography fontWeight={600}>{nombre}</Typography>
          </div>

                    <Box display="flex" alignItems="center" mt={1} gap={1}>
             <IoLocation />
             <Typography>{ciudad},{pais}</Typography>
           </Box>

          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <FaHourglass />
            <Typography>Duración: {duration}</Typography>
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
          {bookingDate && cupoDisponible > 0 && (
            <Typography mt={1} color="primary">
              Cupos disponibles: {cupoDisponible}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions className="Booking-principal-container">
        <ButtonBluePill
          text="Reservar Ahora"
          className= "button-blue btn-save" 
          type="submit"
          onClick={BookingSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;
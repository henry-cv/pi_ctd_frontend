import React, { useState } from "react";
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
import { IoCalendarClear, IoTicket } from "react-icons/io5";
import { FaCreditCard, FaHourglass } from "react-icons/fa";
import ButtonBluePill from "./ButtonBluePill";
import "../css/components/BookingModal.css";
import { useContextGlobal } from "../gContext/globalContext";
import BookingQuantity from "./BookingQuantity";
import Swal from "sweetalert2";
import ActivityPolitics from "./ActivityPolitics";
import { es } from "date-fns/locale";

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
    data: {
      id,
      nombre,
      horaInicio,
      tipoTarifa,
      valorTarifa,
      diasDisponible,
      horaFin,
      fechaEvento,
    } = {},
  } = state.activity || {};
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const [openQuantity, setOpenQuantity] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);
  const [anchorElQuantity, setAnchorElQuantity] = useState(null);
  const totalMinutes = parseTime(horaFin) - parseTime(horaInicio);
  const horas = Math.floor(totalMinutes / 60);
  const minutos = totalMinutes % 60;
  const duration = `${horas} horas y ${minutos} minutos`;
  const [isChecked, setIsChecked] = useState(false);

  console.log(state.isAccessModal);

  const validateCreateBooking = () => {
    const newErrors = {};

    if (!bookingDate) {
      newErrors.date = "Escoger la fecha es requerida";
    }

    if (!quantity) {
      newErrors.slot = "La cantidad de reservas es requerido";
    }

    setErrorsBooking(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (event) => {
    if (validateCreateBooking()) {
      setIsChecked(event.target.checked);
    } else {
      console.log("Validación fallida, no se puede hacer el check.");
    }
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
    // const BookingData = {
    //   idActivity: id,
    //   totalPrice: priceQuantity,
    //   slot: quantity,
    //   date: bookingDate,
    // };
    // console.log("La reserva: ", BookingData);

    const existingReservation = state.reservation?.find(
      (res) => res.idActivity === id && res.idUser === state.user.id
    );

    if (existingReservation) {
      Swal.fire({
        icon: "error",
        title: "Reserva existente",
        text: "ya hiciste una reserva para esta actividad mira toda la información en tus reservas",
        timer: 2000,
        showConfirmButton: false,
      });
      handleClose();
      resetBookingData();
      return;
    }

    dispatch({
      type: "SET_RESERVATION",
      payload: { idActivity: id, idUser: state.user.id },
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
  };

  const handleCloseBookingModal = () => {
    resetBookingData();
    setErrorsBooking((prevErrors) => ({
      ...prevErrors,
      date: "",
      slot: ""
    }));
    handleClose();
  };

  const handleSelectDate = (date) => {
    setBookingDate(date);
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
          cuántos cupos deseas .
        </Typography>

        <Box className="select-date-slot">
          <div className="date">
            <Box  className="select-item">
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
                {format(bookingDate || new Date(), "EEE, dd MMM", {
                  locale: es,
                })}
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
  ? (isMobile ? "tu cupo" : "Selecciona tus cupos") : `${quantity} 
  ${quantity === 1 ? 
  (isMobile ? "Cupo" : "Cupo seleccionado") : 
  (isMobile ? "Cupos" : "Cupos seleccionados")}`}

    </Typography>
  </Box>
</div>
        </Box>

        <BookingCalendar
          anchorEl={anchorEl}
          handleClose={handleCloseCalendar}
          dateRange={dateRange}
          setDateRange={setDateRange}
          availability={
            diasDisponible
              ? { type: "dias", data: diasDisponible }
              : { type: "fecha", data: [fechaEvento] }
          }
          setBookingDate={handleSelectDate}
          bookingDate={bookingDate}
        />

        <BookingQuantity
          open={openQuantity}
          onClose={handleCloseBookingQuantity}
          quantity={quantity}
          setQuantity={handleSelectQuantity}
        />

        {/* aqui se pone si hay menos de 3 reservas  */}

        {/* <Typography color="error" mt={1}>
          ¡Últimas 3 reservas disponibles para esta fecha!
        </Typography> */}

        <ActivityPolitics />

        <Box
          mt={3}
          p={2}
          border={1}
          borderRadius={2}
        >
          <div className="title-checkbox">
            <Typography fontWeight={600}>{nombre}</Typography>
            <FormControlLabel
  control={
    <Checkbox
    className={state.theme ? "my-custom-checkbox" : ""}
      checked={isChecked}
      onChange={handleCheckboxChange}

    />
  }
/>
          </div>
          {/* ubicacion oculta hasta que se pueda aplicar mapa  */}
          {/* <Box display="flex" alignItems="center" mt={1} gap={1}>
            <PlaceIcon />
            <Typography>Cartagena, Colombia</Typography>
          </Box> */}

          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <FaHourglass />
            <Typography>Duración: {duration}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <AccessTimeIcon />
            <Typography>
              Hora de inicio: {horaInicio.substring(0, 5)}
            </Typography>
          </Box>
          <Typography mt={2}>
            {" "}
            {tipoTarifa.toLowerCase().replace(/_/g, " ")} X {valorTarifa} USD
          </Typography>
          <Typography mt={2}>Total: ${priceQuantity} USD</Typography>
        </Box>
      </DialogContent>

      <DialogActions className="Booking-principal-container">
        <ButtonBluePill
          text="Reservar Ahora"
          className={
            isChecked ? "button-blue btn-save" : " btn-save btn-blue-disabled"
          }
          type="submit"
          onClick={BookingSubmit}
          disabled={isChecked ? false : true}
        />
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;

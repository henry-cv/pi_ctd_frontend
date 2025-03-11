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
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";
import BookingCalendar from "./BookingCalendar";
import { IoCalendarClear, IoGameController, IoRadioButtonOff, IoTicket } from "react-icons/io5";
import { FaCreditCard, FaInfo } from "react-icons/fa";
import ButtonBluePill from "./ButtonBluePill";
import "../css/components/BookingModal.css"

const BookingModal = ({ open, handleClose, activityId }) => {
  const [quantity, setQuantity] = useState(1);
  const isMobile = useMediaQuery("(max-width: 480px)");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [priceQuantity , setPriceQuantity] = useState(0) //para guardar luego el precio total ese se iria a reserva 
  const pricePerPerson = 75;
  const total = quantity * pricePerPerson;

  console.log("llegó el id " + activityId);

  const handleOpenCalendar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCalendar = () => {
    setAnchorEl(null);
  };

  const handleOpenBookingQuantity = () => {
    console.log("abre el modal cantidad");
  };

  const BookingSubmit = ()=>{
    console.log("hacer el submit de la reserva ");

  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth  
      sx={{ "& .MuiPaper-rounded": { borderRadius: "25px" } }}

    >
      <DialogTitle color="black" >
        Tour en el centro amurallado
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
        Esta actividad se reserva por persona. Selecciona la fecha y cuántos cupos  deseas .
        </Typography>

        <Box display="flex" alignItems="center" mt={2} gap={1}>
          <IconButton onClick={handleOpenCalendar}>
            <CalendarTodayIcon />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ cursor: "pointer" }}
            onClick={handleOpenCalendar}
          >
            {format(dateRange[0].startDate, "EEE, dd MMM")}
          </Typography>

          
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handleOpenBookingQuantity}>
                <IoTicket />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={handleOpenBookingQuantity}
              >
                Selecciona tus cupos
              </Typography>
            </Box>
 
        </Box>

        <BookingCalendar
          anchorEl={anchorEl}
          handleClose={handleCloseCalendar} 
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        
        {/* aqui se pone si hay menos de 3 reservas  */}

        {/* <Typography color="error" mt={1}>
          ¡Últimas 3 reservas disponibles para esta fecha!
        </Typography> */}

        <Box bgcolor="#f1c40f" p={2} mt={2} borderRadius={2}>
          <Typography fontWeight={600}>
            <IoCalendarClear/>
             Cancelación gratis:{" "}
            <span style={{ fontWeight: "normal" }}>
              hasta 24 horas antes de la experiencia (hora local)
            </span>
          </Typography>
          <Typography fontWeight={600} mt={1}>
            <FaCreditCard/>
             Reserva ahora, paga después:{" "}
            <span style={{ fontWeight: "normal" }}>
              planes flexibles aseguran tu reserva, sin que se te haga el cargo
              hoy.
            </span>
          </Typography>
        </Box>

        <Box mt={3} p={2} border={1} borderRadius={2} className="Card-info-booking">
          <div className="title-checkbox">
            <Typography fontWeight={600}>Tour en el centro amurallado</Typography>
            <FormControlLabel control={<Checkbox />} />
          </div>

          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <PlaceIcon />
            <Typography>Cartagena, Colombia</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <AccessTimeIcon />
            <Typography>Duración: 2 horas</Typography>
          </Box>
          <Box display="flex" alignItems="center" mt={1} gap={1}>
            <AccessTimeIcon />
            <Typography>Hora de inicio: 7:00</Typography>
          </Box>
          <Typography mt={2}>Total: ${total} USD</Typography>
        </Box>
      </DialogContent>

      <DialogActions className="Booking-principal-container">
        <ButtonBluePill
          text="Reservar Ahora"
          className="button-blue btn-save"
          type="submit"
          onClick ={BookingSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;

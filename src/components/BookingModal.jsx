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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";
import BookingCalendar from "./BookingCalendar";
import { IoCalendarClear, IoRadioButtonOff } from "react-icons/io5";
import { FaCreditCard } from "react-icons/fa";
import ButtonBluePill from "./ButtonBluePill";

const BookingModal = ({ open, handleClose, activityId }) => {
  const [quantity, setQuantity] = useState(1);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const pricePerPerson = 75;
  const total = quantity * pricePerPerson;


  console.log("llegó el id "+activityId);
  //traer la info del producto con el fetch o guardar en el global y traer aqui luego la info
  

  const handleOpenCalendar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCalendar = () => {
    setAnchorEl(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
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
          Esta actividad es por persona. Selecciona cuántas reservas deseas.
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

 
          <PersonIcon />
          <Select
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            size="small"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </Box>

     
        <BookingCalendar
          anchorEl={anchorEl}
          handleClose={handleCloseCalendar} 
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <Typography color="error" mt={1}>
          ¡Últimas 3 reservas disponibles para esta fecha!
        </Typography>

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


        <Box mt={3} p={2} border={1} borderRadius={2}>
          <div >
          <Typography fontWeight={600}>Tour en el centro amurallado</Typography>
          <FormControlLabel control={<Checkbox/>}/>
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

      <DialogActions>
                <ButtonBluePill
                  text= "Reservar Ahora"
                  className="button-blue btn-save"
                  type="submit"
                  
                />
        {/* <Button variant="contained" fullWidth sx={{ bgcolor: "#7D5FFF" }}>
          Reservar ahora
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;

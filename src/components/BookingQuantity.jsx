import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Box, Typography, useMediaQuery } from "@mui/material";
import { useContextGlobal } from "../gContext/globalContext";
import  "../css/components/BookingQuantity.css"
import ButtonBluePill from "./ButtonBluePill";

function BookingQuantity({ open, onClose, quantity, setQuantity,cupoDisponible ,tipoTarifa,isBooking}) {

  const isMobile = useMediaQuery("(max-width: 480px)");
  const{state}= useContextGlobal();
  // console.log("la cantidad es", state.activity?.theActivity?.disponibilidadProductoSalidaDto?.cuposReservados);

  useEffect(() => {
    if (!quantity) {
      setTempQuantity(0);
    }
  }, [quantity]);

  useEffect(() => {
  
    if (isBooking) {
      const cuposReservados = state.activity?.theActivity?.disponibilidadProductoSalidaDto?.cuposReservados || 0;
      setQuantity(cuposReservados);
      setTempQuantity(cuposReservados);
    }
  }, [isBooking, state.theBooking?.isBooking]);

  const [tempQuantity, setTempQuantity] = useState(quantity);



  const handleApply = () => {
    console.log("Aplicando cantidad:", tempQuantity);  
    setQuantity(tempQuantity); 
    onClose(tempQuantity);  
  };

  const slotsQuantityIncrement = ( tipoTarifa) => {
      switch (tipoTarifa) {
        case "POR_PERSONA":
          return  1;
        case "POR_PAREJA":
          return  2 ;
        case "POR_GRUPO_6":
          return  6 ;
        case "POR_GRUPO_10":
          return 10 ;
        default:
          return "no es posible escoger los cupos";
      }
    };

  const handleDecreaseAndIncrease = (operation) => {

      let addOrSustractQuantity = slotsQuantityIncrement(tipoTarifa)
      
    if(operation === "add"){
      setTempQuantity((prev) => Math.min(prev + addOrSustractQuantity, cupoDisponible));
    }else{
      setTempQuantity((prev) => Math.max(0, prev - addOrSustractQuantity));}
    
  };



  

  return (
    <Dialog 
    className={isMobile ? (state.theme ? "mobile dark" : "mobile") : (state.theme ? "quantity-container dark" : "quantity-container")}
    open={open} 
    onClose={onClose}
    sx={{ "& .MuiPaper-rounded": { borderRadius: isMobile? "20px 20px 0px 0px" : "20px"} }}
    >
      
      {/* <DialogTitle color="black">Selecciona el número de reservas</DialogTitle> */}
      <DialogContent>
      <Typography>
      Esta actividad es {tipoTarifa.toLowerCase().replace(/_/g, " ")}. Selecciona cuántos cupos deseas reservar.
      </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <Typography>
      Cantidad de cupos 
      </Typography>
          <IconButton onClick={() =>handleDecreaseAndIncrease("sustract")}>
            ➖
          </IconButton>
          <Typography variant="h6">{tempQuantity}</Typography>
          <IconButton onClick={() =>handleDecreaseAndIncrease("add")}>
            ➕
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <ButtonBluePill
        text="Aplicar"
        className={`btn-modal-quantity ${tempQuantity === 0 ? "btn-save btn-blue-disabled" : "button-blue btn-save"}`}
        onClick={tempQuantity > 0 ? handleApply : undefined} 
        />

      </DialogActions>
    </Dialog>
  );
}

export default BookingQuantity;
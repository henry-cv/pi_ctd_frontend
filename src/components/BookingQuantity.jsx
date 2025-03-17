import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Box, Typography, useMediaQuery } from "@mui/material";
import { useContextGlobal } from "../gContext/globalContext";
import  "../css/components/BookingQuantity.css"
import ButtonBluePill from "./ButtonBluePill";

function BookingQuantity({ open, onClose, quantity, setQuantity }) {

  const isMobile = useMediaQuery("(max-width: 480px)");

  useEffect(() => {
    if (!quantity) {
      setTempQuantity(0);
    }
  }, [quantity]);

  const [tempQuantity, setTempQuantity] = useState(quantity);
  const{state}= useContextGlobal();
  const {
    data: {tipoTarifa,} = {},} = state.activity || {};

  const handleApply = () => {
    console.log("Aplicando cantidad:", tempQuantity);  
    setQuantity(tempQuantity); 
    onClose(tempQuantity);  
  };

  // const handleIncrease = () => {
  //   console.log("entre a incrementar");
    
  //   setTempQuantity((prev) => prev + 1);
  // };

  // const handleDecrease = () => {
  //   setTempQuantity((prev) => Math.max(0, prev - 1));
  // };

  const handleDecreaseAndIncrease = (operation) => {

    if(operation === "add"){
      setTempQuantity((prev) => prev + 1);
    }else{
      setTempQuantity((prev) => Math.max(0, prev - 1));}
    
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
      Esta actividad es {tipoTarifa.toLowerCase().replace(/_/g, " ")}. Selecciona cuántas reservas deseas.
      </Typography>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <Typography>
      Cantidad de reservas
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
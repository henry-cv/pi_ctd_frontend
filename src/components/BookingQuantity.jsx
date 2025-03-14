import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Box, Typography } from "@mui/material";
import { useContextGlobal } from "../gContext/globalContext";

function BookingQuantity({ open, onClose, quantity, setQuantity }) {

  useEffect(() => {
    if (!quantity) {
      setTempQuantity(0);
    }
  }, [quantity]);

  const [tempQuantity, setTempQuantity] = useState(quantity);
  const{state}= useContextGlobal();
  const {
    data: {
      id,
      nombre,
      horaInicio,
      tipoTarifa,
      valorTarifa,
      diasDisponible,
      horaFin,
    } = {},
  } = state.activity || {};

  const handleApply = () => {
    console.log("Aplicando cantidad:", tempQuantity);  
    setQuantity(tempQuantity); 
    onClose(tempQuantity);  
  };

  
  const handleIncrease = () => {
    console.log("entre a incrementar");
    
    setTempQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setTempQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <Dialog 
    open={open} 
    onClose={onClose}
    sx={{ "& .MuiPaper-rounded": { borderRadius: "25px" } }}
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
          <IconButton onClick={handleDecrease}>
            ➖
          </IconButton>
          <Typography variant="h6">{tempQuantity}</Typography>
          <IconButton onClick={handleIncrease}>
            ➕
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApply}>Aplicar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BookingQuantity;

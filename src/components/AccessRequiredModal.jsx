import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";


const AccesRequiredModal = ({ open, onClose, onLogin, onSignup }) => {

    const handleClose = () => {
        onClose()
    };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color='black'> ¿Listo para reservar? 
      <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
        Inicia sesión o crea una cuenta para continuar."
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onLogin}>Iniciar sesión</Button>
        <Button variant="contained" onClick={onSignup}>Crear cuenta</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccesRequiredModal;
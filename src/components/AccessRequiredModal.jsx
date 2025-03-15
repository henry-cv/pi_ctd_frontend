import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import ButtonBluePill from "./ButtonBluePill";
import { Link } from 'react-router-dom';
import { useContextGlobal } from '../gContext/globalContext';
import "../css/components/AccessRequired.css"

const AccesRequiredModal = ({ open, onClose, onLogin, onSignup }) => {
    const { state,dispatch } = useContextGlobal();


    const handleClose = () => {
        onClose()
    };

    const handleSaveUrl = () => {
      const currentUrl = location.pathname;  
            
    dispatch({
      type: "SET_URL_REDIRECTION",
      payload: currentUrl ,
    });

    dispatch({
      type: "ORIGIN_ACCESS",
      payload: true ,
    });
  };

  return (
    <Dialog 
    open={open} 
    onClose={onClose}
    sx={{ "& .MuiPaper-rounded": { 
      borderRadius: "20px",
      padding: "24px",       
      margin: "16px",       
      minWidth: "300px",     
      textAlign: "center",
    } }}
    className={state.theme ? "access-container " : ""}
    >
      <DialogTitle  className={state.theme ? "font-dark" : "font-ligth"}> ¿Listo para reservar?  
      <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon  className={state.theme ? "font-dark" : "font-ligth"} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
        Inicia sesión o crea una cuenta para continuar
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-around" }}>

                <Link to="/registro" onClick={handleSaveUrl}>    
                <ButtonBluePill
                text="Registrarte"
                className="button-yellow btn-preview"
                type="button"
                />
                </Link>

                <Link to="/entrar"onClick={handleSaveUrl}>
                <ButtonBluePill
                text="Iniciar Sesión"
                className="button-blue btn-save"
                type="button"
                />
                </Link>



      </DialogActions>
    </Dialog>
  );
};

export default AccesRequiredModal;
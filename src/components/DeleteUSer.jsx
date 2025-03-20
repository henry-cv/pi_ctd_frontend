import { useEffect } from "react";
import Swal from "sweetalert2";
import "../css/components/DeleteUSer.css"
import { useContextGlobal } from "../gContext/globalContext";
import { useNavigate } from "react-router-dom";

const DeleteUSer = ({ id, onClose }) => {
    const {state, dispatch } = useContextGlobal();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT_USER" });
        navigate("/", { replace: true });
      };

  useEffect(() => {
    Swal.fire({
      title: "¿Estás seguro que quieres eliminar tu cuenta?",
      text: `Luego de borrada , no podrás recuperarla .`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`, 
        confirmButton: "custom-button", 
        cancelButton: "swal2-cancel", 
    }
    }).then((result) => {
      if (result.isConfirmed) {
        // consumir la api de elminar cuenta 
        console.log(`Cuenta con ID ${id} eliminada`);
        Swal.fire({
          title: "Eliminada",
          text: "Tu cuenta ha sido eliminada con éxito.",
          confirmButtonText: "Ok",
          icon: "success",
          customClass: {
            popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
            confirmButton: "custom-button",}
        });
        handleLogout();
      }
      onClose();
      
       
    });
  }, [id, onClose]);

  return null; 
}

export default DeleteUSer;

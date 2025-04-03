import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import PropTypes from 'prop-types';
import { useContextGlobal } from "../gContext/globalContext";
import Swal from "sweetalert2";
import "../css/components/DeleteUSer.css"

const CategoryRow = ({ id, nombre, imagenCategoriaUrl, onDelete, onUpdate }) => {
  const { state } = useContextGlobal();
  //console.log(`Imagen: ${imagenCategoriaUrl}`);

  const handleDelete = async () => {

    const result = await Swal.fire({
      title: "¿Deseas eliminar esta categoría?",
      text: "Esta acción no se puede deshacer. La categoría se eliminará permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
        confirmButton: "custom-button",
        cancelButton: "swal2-cancel",
      }
    });


    if (result.isConfirmed) {
      try {
        const token = state.token || localStorage.getItem("token");

        const response = await fetch(`/api/categoria/eliminar?id=${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar: ${response.status}`);
        }

        Swal.fire({
          title: "¡Categoría eliminada!",
          text: "La categoría ha sido eliminada exitosamente.",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
          }
        });

        onDelete && onDelete(id);
      } catch (error) {
        console.error("Error eliminando la categoría:", error);
        Swal.fire({
          title: "Error",
          text: `Ocurrió un problema al eliminar la categoría: ${error.message}`,
          icon: "error",
          timer: 4000,
          showConfirmButton: false,
          customClass: {
            popup: `swal2-popup ${state.theme ? "swal2-dark" : ""}`,
          }
        });
      }
    }
  };

  return (
    <div className="RegisterCategory">
      <div className="infoCategory infoActivitie">
        <input type="checkbox" className="inputCategory inputActivitie" />
        <img src={imagenCategoriaUrl} alt="Categoria" width={50} className="categoryImg" />
        <p>{nombre}</p>
      </div>
      <div className="btn_action">
        <button className="btn_blueAction" onClick={onUpdate} >
          <FaEdit size={"1.2rem"} />
        </button>
        <button className="btn_redAction" onClick={handleDelete}>
          <RiDeleteBin5Fill size={"1.2rem"} />
        </button>
      </div>
    </div>
  )
}

CategoryRow.propTypes = {
  id: PropTypes.number.isRequired,
  nombre: PropTypes.string.isRequired,
  imagenCategoriaUrl: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};
export default CategoryRow

import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import PropTypes from 'prop-types';
import { useContextGlobal } from "../gContext/globalContext";

const CategoryRow = ({ id, nombre, imagenCategoriaUrl, onDelete }) => {
  const { state } = useContextGlobal();
  //console.log(`Imagen: ${imagenCategoriaUrl}`);
  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
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
        onDelete && onDelete(id);
      } catch (error) {
        console.error("Error eliminando la categoría:", error);
        alert("Error eliminando la categoría");
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
        <button className="btn_blueAction">
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
  descripcion: PropTypes.string.isRequired,
  imagenCategoriaUrl: PropTypes.string.isRequired,
  onDelete: PropTypes.func
};
export default CategoryRow
